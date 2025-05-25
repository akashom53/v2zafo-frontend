export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    __v: number;
}

export interface Question {
    _id: string;
    cardId: string;
    title: string;
    description: string;
    question: string;
    user: User;
    __v: number;
}

// API response type for array of questions
export type QuestionsResponse = Question[];

export interface CreateQuestionRequest {
    cardId: string;
    title: string;
    description: string;
    question: string;
}