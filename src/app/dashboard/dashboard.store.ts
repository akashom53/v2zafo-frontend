import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DashboardService } from './dashboard.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { CreateQuestionRequest, Question } from './dashboard.dto';
import { tapResponse } from '@ngrx/operators'
// type Question = {
//     question: string;
// }

type Card = {
    title: string;
    cols: number;
    rows: number;
    id: string;
}

type DashboardState = {
    cards: Card[];
    questions: Question[];
}


const initialDashboardState: DashboardState = {
    cards: [
        { title: 'Created by me', cols: 1, rows: 1, id: 'createdByMe' },
        { title: 'Everyone', cols: 1, rows: 1, id: 'everyone' },
        { title: 'Team A', cols: 1, rows: 1, id: 'teamA' },
        { title: 'Admin Staff', cols: 1, rows: 1, id: 'adminStaff' },
    ],
    questions: []
}


export const DashboardStore = signalStore(
    { providedIn: 'root' },
    withState(initialDashboardState),
    withComputed(({ cards, questions }) => ({
        questionsByCard: computed(() => {
            const questionsByCard: Record<string, Question[]> = {};

            cards().forEach((card) => {
                questionsByCard[card.id] = questions().filter((question) => question.cardId === card.id);
            });
            console.log(questionsByCard)
            return questionsByCard;
        })
    })),
    withMethods((store, dashboardService = inject(DashboardService)) => ({
        pinQuestion: rxMethod<CreateQuestionRequest>(
            pipe(
                switchMap((question) => {
                    return dashboardService.pinQuestion(question)
                        .pipe(
                            tapResponse({
                                next: (question) => {
                                    console.log("success saved", question)
                                    patchState(store, (state) => ({
                                        questions: [...state.questions, question]
                                    }))
                                },
                                error: (error) => {
                                    console.error('Error pinning question:', error);
                                }
                            })
                        )
                }

                )
            )
        ),
        fetchQuestions: rxMethod<void>(
            pipe(
                switchMap(() => {
                    console.log('fetching questions')
                    return dashboardService.getQuestions()
                        .pipe(
                            tapResponse({
                                next: (questions) => {
                                    patchState(store, (state) => ({ ...state, questions }))
                                },
                                error: (error) => {
                                    console.error('Error pinning question:', error);
                                }
                            })
                        )
                })
            )
        )
    }))
)