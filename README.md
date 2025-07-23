# QuizGen - PDF to Quiz Generator

A modern, hackathon-ready web application that transforms PDF documents into interactive quizzes using Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

## 🚀 Features

- **PDF Upload**: Drag and drop or click to upload PDF files
- **Quiz Generation**: Generates 5 multiple-choice questions from uploaded PDFs
- **Interactive Quiz**: Take the quiz with immediate feedback
- **Smart Feedback**: Get explanations for correct and incorrect answers
- **Dive Deeper**: Access detailed explanations for each question
- **Progress Tracking**: Visual progress indicator during quiz
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: React State + Context API

## 🔗 Frontend-Backend Integration

### API Client Setup

#### Create API Client
```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
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
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async generateQuiz(uploadId: string): Promise<QuizResponse> {
    const response = await fetch(`${this.baseURL}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uploadId, questionCount: 5 }),
    });

    if (!response.ok) {
      throw new Error('Quiz generation failed');
    }

    return response.json();
  }

  async getQuiz(quizId: string): Promise<QuizData> {
    const response = await fetch(`${this.baseURL}/quiz/${quizId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    return response.json();
  }

  async submitQuiz(quizId: string, answers: Answer[]): Promise<QuizResult> {
    const response = await fetch(`${this.baseURL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit quiz');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
```

#### Updated Types
```typescript
// lib/types.ts
export interface UploadResponse {
  success: boolean;
  data: {
    uploadId: string;
    filename: string;
    extractedText: string;
    processingStatus: string;
  };
}

export interface QuizResponse {
  success: boolean;
  data: {
    quizId: string;
    title: string;
    questions: Question[];
  };
}

export interface QuizResult {
  success: boolean;
  data: {
    score: number;
    totalQuestions: number;
    results: {
      questionId: string;
      correct: boolean;
      explanation: string;
    }[];
  };
}

// ...existing types...
```

### Updated Frontend Components

#### Upload Page Integration
```typescript
// app/page.tsx (key changes)
const generateQuiz = async () => {
  if (!file) {
    toast.error("Please upload a PDF file first");
    return;
  }

  setIsUploading(true);
  
  try {
    // Upload PDF
    const uploadResponse = await apiClient.uploadPDF(file);
    
    // Generate quiz
    const quizResponse = await apiClient.generateQuiz(uploadResponse.data.uploadId);
    
    // Store quiz ID for navigation
    localStorage.setItem('currentQuizId', quizResponse.data.quizId);
    localStorage.setItem('quizData', JSON.stringify(quizResponse.data));
    
    toast.success("Quiz generated successfully!");
    router.push("/quiz");
  } catch (error) {
    toast.error("Failed to generate quiz. Please try again.");
    console.error('Quiz generation error:', error);
  } finally {
    setIsUploading(false);
  }
};
```

#### Quiz Page Integration
```typescript
// app/quiz/page.tsx (key changes)
useEffect(() => {
  const loadQuiz = async () => {
    const quizId = localStorage.getItem('currentQuizId');
    
    if (quizId) {
      try {
        const quizData = await apiClient.getQuiz(quizId);
        setQuizData(quizData);
      } catch (error) {
        console.error('Failed to load quiz:', error);
        toast.error("Failed to load quiz");
        router.push("/");
      }
    } else {
      toast.error("No quiz found. Please upload a PDF first.");
      router.push("/");
    }
  };

  loadQuiz();
}, [router]);

// Submit quiz to backend when completed
const handleQuizSubmit = async () => {
  try {
    const quizId = localStorage.getItem('currentQuizId');
    const result = await apiClient.submitQuiz(quizId!, answers);
    
    // Update UI with results
    setQuizResults(result.data);
    setQuizCompleted(true);
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    toast.error("Failed to submit quiz");
  }
};
```

### Environment Configuration

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
```

#### Backend (.env)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/quizgen
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quizgen
DB_USER=username
DB_PASS=password

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Security
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:3000

# Storage (if using cloud)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=quizgen-uploads
AWS_REGION=us-east-1
```

### Deployment Strategy

#### 1. Full-Stack Deployment (Recommended)
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Render, or DigitalOcean
- **Database**: Use Railway PostgreSQL, Neon, or Supabase
- **Files**: Use cloud storage (AWS S3, Vercel Blob)

#### 2. Next.js Full-Stack (Fastest)
- **All-in-one**: Deploy entire app to Vercel
- **API Routes**: Use Next.js API routes for backend
- **Database**: Use Vercel Postgres or Neon
- **Files**: Use Vercel Blob storage

#### 3. Serverless (Scalable)
- **Frontend**: Vercel
- **Backend**: Vercel Functions or AWS Lambda
- **Database**: PlanetScale or Neon
- **Files**: AWS S3 or Cloudinary

### Quick Start Commands

#### Backend Setup (Node.js)
```bash
# Create backend directory
mkdir quizgen-backend && cd quizgen-backend

# Initialize project
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv multer
npm install pdf-parse openai pg prisma
npm install -D nodemon typescript @types/node

# Start development
npm run dev
```

#### Database Setup (PostgreSQL)
```bash
# Using Docker
docker run --name quizgen-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Or use cloud service
# Railway: railway.app
# Neon: neon.tech
# Supabase: supabase.com
```

This implementation plan provides a complete roadmap for building a production-ready backend and integrating it with your existing frontend. The modular approach allows you to start simple and add complexity as needed.
