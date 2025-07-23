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

## 📁 Project Structure

```
app/
├── app/
│   ├── layout.tsx          # Root layout with Sonner toaster
│   ├── page.tsx            # Upload page with file handling
│   └── quiz/
│       └── page.tsx        # Quiz interface with feedback
├── components/
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   └── sonner.tsx
│   ├── file-upload.tsx     # Reusable file upload component
│   ├── loading-spinner.tsx # Loading spinner component
│   └── question-card.tsx   # Quiz question component
├── lib/
│   ├── utils.ts           # Utility functions (cn helper)
│   ├── types.ts           # TypeScript type definitions
│   └── quiz-context.tsx   # Quiz state management context
└── package.json
```

## 🎯 Key Components

### Upload Page (`/`)
- Clean, modern upload interface
- Drag and drop functionality
- PDF file validation
- Loading states during quiz generation
- Feature overview cards

### Quiz Page (`/quiz`)
- Question navigation (Previous/Next)
- Radio button selection with visual feedback
- Immediate answer validation
- Progress tracking
- Completion summary

### Quiz Summary
- Score display
- Per-question review with feedback
- "Dive Deeper" modals for detailed explanations
- Options to retake quiz or upload new PDF

## 🔧 Components Architecture

### Reusable Components
- **FileUpload**: Handles PDF file selection with drag/drop
- **QuestionCard**: Displays quiz questions with feedback states
- **LoadingSpinner**: Consistent loading indicator

### UI Components (Shadcn)
- **Button**: Primary actions and navigation
- **Card**: Content containers
- **Dialog**: Modal dialogs for "Dive Deeper" content
- **Progress**: Quiz progress indicator
- **RadioGroup**: Answer selection
- **Input**: File input handling

## 🎨 Design Features

- **Gradient Backgrounds**: Blue-to-indigo gradients for visual appeal
- **Color-Coded Feedback**: Green for correct, red for incorrect answers
- **Hover States**: Interactive elements with smooth transitions
- **Responsive Grid**: Adapts to different screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

## 📝 How It Works

1. **Upload**: User uploads a PDF file via drag/drop or file picker
2. **Processing**: App simulates AI processing (2-second delay for demo)
3. **Storage**: Quiz data is stored in localStorage for persistence
4. **Quiz**: User takes a 5-question multiple choice quiz
5. **Feedback**: Immediate feedback with explanations
6. **Summary**: Complete review with deep-dive explanations

## 🎭 Mock Data

The application includes realistic mock quiz data that simulates AI-generated questions from PDF content, including:
- Contextual questions
- Multiple choice options
- Detailed explanations
- Extended "dive deeper" content

## 🔮 Future Enhancements

- Real PDF parsing and AI integration
- User authentication and quiz history
- Custom quiz lengths
- Question difficulty levels
- Export quiz results
- Social sharing features

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive design
- Optimized for mobile quiz-taking
- Swipe gestures (future enhancement)

## 🎯 Hackathon Ready

This MVP is designed for rapid development and demonstration:
- Clean, professional UI
- Working end-to-end flow
- Extensible architecture
- Modern tech stack
- Production-ready components

Perfect for hackathons, prototypes, or as a starting point for a full-featured quiz generation platform!

## 🏗️ Backend Implementation Plan

### Tech Stack Options

#### Option 1: Node.js/Express + OpenAI (Recommended for Hackathon)
- **Runtime**: Node.js with Express.js
- **AI Service**: OpenAI GPT-4 API
- **PDF Processing**: pdf-parse or pdf2pic
- **Database**: PostgreSQL or MongoDB
- **File Storage**: Local filesystem or AWS S3
- **Deployment**: Vercel, Railway, or DigitalOcean

#### Option 2: Python FastAPI + OpenAI
- **Runtime**: Python with FastAPI
- **AI Service**: OpenAI GPT-4 API
- **PDF Processing**: PyPDF2, pdfplumber, or pymupdf
- **Database**: PostgreSQL with SQLAlchemy
- **File Storage**: Local filesystem or cloud storage
- **Deployment**: Railway, Render, or AWS

#### Option 3: Next.js API Routes (Fastest Setup)
- **Runtime**: Next.js API routes
- **AI Service**: OpenAI GPT-4 API
- **PDF Processing**: pdf-parse
- **Database**: Prisma with PostgreSQL/SQLite
- **File Storage**: Vercel Blob or local
- **Deployment**: Vercel (seamless)

### Backend Architecture

```
backend/
├── src/
│   ├── routes/
│   │   ├── upload.js          # PDF upload endpoint
│   │   ├── quiz.js            # Quiz generation & retrieval
│   │   └── health.js          # Health check
│   ├── services/
│   │   ├── pdfParser.js       # PDF text extraction
│   │   ├── aiService.js       # OpenAI integration
│   │   └── quizGenerator.js   # Quiz logic
│   ├── models/
│   │   ├── Quiz.js            # Quiz data model
│   │   └── Question.js        # Question data model
│   ├── middleware/
│   │   ├── upload.js          # File upload handling
│   │   ├── validation.js      # Input validation
│   │   └── errorHandler.js    # Error handling
│   └── utils/
│       ├── logger.js          # Logging utility
│       └── constants.js       # App constants
├── uploads/                   # Temporary file storage
├── .env                       # Environment variables
└── package.json
```

### API Endpoints Design

#### 1. PDF Upload & Processing
```http
POST /api/upload
Content-Type: multipart/form-data

Request:
- file: PDF file (max 10MB)

Response:
{
  "success": true,
  "data": {
    "uploadId": "uuid-here",
    "filename": "document.pdf",
    "extractedText": "...",
    "processingStatus": "completed"
  }
}
```

#### 2. Quiz Generation
```http
POST /api/quiz/generate
Content-Type: application/json

Request:
{
  "uploadId": "uuid-here",
  "questionCount": 5,
  "difficulty": "medium"
}

Response:
{
  "success": true,
  "data": {
    "quizId": "quiz-uuid",
    "title": "Quiz from document.pdf",
    "questions": [
      {
        "id": 1,
        "question": "What is the main topic?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 0,
        "explanation": "...",
        "diveDeeper": "..."
      }
    ]
  }
}
```

#### 3. Quiz Retrieval
```http
GET /api/quiz/:quizId

Response:
{
  "success": true,
  "data": {
    "quizId": "quiz-uuid",
    "title": "Quiz Title",
    "questions": [...],
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

#### 4. Answer Submission
```http
POST /api/quiz/:quizId/submit
Content-Type: application/json

Request:
{
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": 0
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "score": 4,
    "totalQuestions": 5,
    "results": [
      {
        "questionId": 1,
        "correct": true,
        "explanation": "..."
      }
    ]
  }
}
```

### Database Schema

#### PostgreSQL Schema
```sql
-- Users table (optional for MVP)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Uploads table
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  extracted_text TEXT,
  upload_path VARCHAR(500),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  upload_id UUID REFERENCES uploads(id),
  user_id UUID REFERENCES users(id),
  total_questions INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- ["option1", "option2", "option3", "option4"]
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  dive_deeper TEXT,
  question_order INTEGER NOT NULL
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES users(id),
  answers JSONB NOT NULL, -- [{"questionId": "uuid", "selectedAnswer": 0}]
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### AI Integration (OpenAI)

#### Quiz Generation Prompt
```javascript
const generateQuizPrompt = (extractedText) => `
You are an expert quiz generator. Based on the following document content, create exactly 5 multiple-choice questions.

Document Content:
${extractedText}

Requirements:
1. Generate 5 diverse questions covering different aspects of the document
2. Each question should have 4 options (A, B, C, D)
3. Provide the correct answer index (0-3)
4. Include a brief explanation for the correct answer
5. Provide an extended "dive deeper" explanation with additional context

Return ONLY a valid JSON object in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation why this is correct.",
      "diveDeeper": "Extended explanation with additional context and details."
    }
  ]
}
`;
```

#### OpenAI Service Implementation
```javascript
// services/aiService.js
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateQuiz(extractedText) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert quiz generator that creates educational multiple-choice questions."
          },
          {
            role: "user",
            content: generateQuizPrompt(extractedText)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate quiz');
    }
  }
}
```

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
