export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  diveDeeper: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface Answer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizState {
  quizData: QuizData | null;
  currentQuestionIndex: number;
  answers: Answer[];
  isCompleted: boolean;
}
