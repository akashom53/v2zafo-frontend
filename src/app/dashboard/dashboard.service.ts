import { inject, Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { QuestionsResponse, CreateQuestionRequest, Question } from './dashboard.dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService)

  getQuestions() {
    return this.apiService.get<QuestionsResponse>('questions')
  }

  pinQuestion(req: CreateQuestionRequest) {
    return this.apiService.post<Question>('questions', req)
  }
}
