// API Client for QuizGen Backend Integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || 'Upload failed');
    }

    return response.json();
  }

  async generateQuiz(uploadId: string, questionCount: number = 5): Promise<QuizGenerationResponse> {
    const response = await fetch(`${this.baseURL}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadId, questionCount }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Quiz generation failed' }));
      throw new Error(errorData.error || 'Quiz generation failed');
    }

    return response.json();
  }

  async getQuiz(quizId: string): Promise<QuizResponse> {
    const response = await fetch(`${this.baseURL}/quiz/${quizId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch quiz' }));
      throw new Error(errorData.error || 'Failed to fetch quiz');
    }

    return response.json();
  }

  async submitQuiz(quizId: string, answers: Answer[]): Promise<QuizSubmissionResponse> {
    const response = await fetch(`${this.baseURL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to submit quiz' }));
      throw new Error(errorData.error || 'Failed to submit quiz');
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types for API responses (imported from types.ts)
import type { 
  UploadResponse, 
  QuizGenerationResponse, 
  QuizResponse, 
  QuizSubmissionResponse, 
  Answer 
} from './types';
