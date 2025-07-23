"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizData, Answer } from '@/lib/types';

interface QuizState {
  quizData: QuizData | null;
  currentQuestionIndex: number;
  answers: Answer[];
  isCompleted: boolean;
}

type QuizAction =
  | { type: 'SET_QUIZ_DATA'; payload: QuizData }
  | { type: 'SET_CURRENT_QUESTION'; payload: number }
  | { type: 'ADD_ANSWER'; payload: Answer }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  quizData: null,
  currentQuestionIndex: 0,
  answers: [],
  isCompleted: false,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_QUIZ_DATA':
      return {
        ...state,
        quizData: action.payload,
      };
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };
    case 'ADD_ANSWER':
      const filteredAnswers = state.answers.filter(
        a => a.questionId !== action.payload.questionId
      );
      return {
        ...state,
        answers: [...filteredAnswers, action.payload],
      };
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isCompleted: true,
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
