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

// API Response Types
export interface UploadResponse {
  success: boolean;
  data?: {
    uploadId: string;
    filename: string;
    originalName: string;
    extractedTextLength: number;
    processingStatus: string;
  };
  error?: string;
}

export interface QuizGenerationResponse {
  success: boolean;
  data?: {
    quizId: string;
    title: string;
    questions: Question[];
  };
  error?: string;
}

export interface QuizResponse {
  success: boolean;
  data?: {
    quizId: string;
    title: string;
    questions: Question[];
    sourceDocument: string;
    createdAt: string;
  };
  error?: string;
}

export interface QuizSubmissionResponse {
  success: boolean;
  data?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    results: QuizResult[];
    message: string;
  };
  error?: string;
}

export interface QuizResult {
  questionId: number;
  correct: boolean;
  explanation: string;
  diveDeeper: string;
  userAnswer: number;
  correctAnswer: number;
}
