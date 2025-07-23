# QuizGen Backend Implementation Guide

## Quick Start (4-Hour Hackathon Approach)

### Option 1: Next.js API Routes (Fastest - Recommended for Hackathon)

This approach keeps everything in one codebase and deploys to Vercel seamlessly.

#### 1. Install Additional Dependencies

```bash
cd /home/bad-dev/QuizGen/app
pnpm add pdf-parse openai @prisma/client prisma multer
pnpm add -D @types/multer
```

#### 2. Set up Prisma Database

```bash
# Initialize Prisma
npx prisma init

# Create schema
```

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Upload {
  id            String   @id @default(cuid())
  filename      String
  originalName  String
  fileSize      Int
  mimeType      String
  extractedText String?
  uploadPath    String?
  createdAt     DateTime @default(now())
  quizzes       Quiz[]
}

model Quiz {
  id             String     @id @default(cuid())
  title          String
  uploadId       String
  upload         Upload     @relation(fields: [uploadId], references: [id])
  totalQuestions Int        @default(5)
  createdAt      DateTime   @default(now())
  questions      Question[]
  attempts       QuizAttempt[]
}

model Question {
  id           String   @id @default(cuid())
  quizId       String
  quiz         Quiz     @relation(fields: [quizId], references: [id])
  questionText String
  options      String[] // Array of options
  correctAnswer Int
  explanation  String
  diveDeeper   String
  questionOrder Int
}

model QuizAttempt {
  id          String   @id @default(cuid())
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  answers     Json     // Store answers as JSON
  score       Int
  completedAt DateTime @default(now())
}
```

#### 3. Create API Routes

Create `app/api/upload/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import PDFParse from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files allowed' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Extract text from PDF
    const pdfData = await PDFParse(buffer);
    const extractedText = pdfData.text;

    // Save to database
    const upload = await prisma.upload.create({
      data: {
        filename,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        extractedText,
        uploadPath: filepath,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadId: upload.id,
        filename: upload.filename,
        originalName: upload.originalName,
        extractedText: upload.extractedText,
        processingStatus: 'completed',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
```

Create `app/api/quiz/generate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateQuizPrompt = (extractedText: string) => `
You are an expert quiz generator. Based on the following document content, create exactly 5 multiple-choice questions.

Document Content:
${extractedText.substring(0, 3000)} // Limit content to avoid token limits

Requirements:
1. Generate 5 diverse questions covering different aspects of the document
2. Each question should have 4 options
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

export async function POST(request: NextRequest) {
  try {
    const { uploadId, questionCount = 5 } = await request.json();

    // Get upload data
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!upload || !upload.extractedText) {
      return NextResponse.json({ success: false, error: 'Upload not found' }, { status: 404 });
    }

    // Generate quiz using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert quiz generator that creates educational multiple-choice questions."
        },
        {
          role: "user",
          content: generateQuizPrompt(upload.extractedText)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const aiResponse = JSON.parse(content);

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz from ${upload.originalName}`,
        uploadId: upload.id,
        totalQuestions: questionCount,
      },
    });

    // Create questions
    const questions = await Promise.all(
      aiResponse.questions.map((q: any, index: number) =>
        prisma.question.create({
          data: {
            quizId: quiz.id,
            questionText: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            diveDeeper: q.diveDeeper,
            questionOrder: index + 1,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        quizId: quiz.id,
        title: quiz.title,
        questions: questions.map((q, index) => ({
          id: index + 1,
          question: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          diveDeeper: q.diveDeeper,
        })),
      },
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ success: false, error: 'Quiz generation failed' }, { status: 500 });
  }
}
```

Create `app/api/quiz/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        quizId: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map((q, index) => ({
          id: index + 1,
          question: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          diveDeeper: q.diveDeeper,
        })),
        createdAt: quiz.createdAt,
      },
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
```

Create `app/api/quiz/[id]/submit/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { answers } = await request.json();

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const results = answers.map((answer: any) => {
      const question = quiz.questions[answer.questionId - 1];
      const correct = question.correctAnswer === answer.selectedAnswer;
      if (correct) score++;

      return {
        questionId: answer.questionId,
        correct,
        explanation: question.explanation,
      };
    });

    // Save attempt
    await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        answers: answers,
        score,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalQuestions: quiz.questions.length,
        results,
      },
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit quiz' }, { status: 500 });
  }
}
```

#### 4. Environment Setup

Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quizgen"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key-here"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

#### 5. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio
npx prisma studio
```

#### 6. Update Frontend to Use API

Update your existing `app/page.tsx` generateQuiz function:
```typescript
const generateQuiz = async () => {
  if (!file) {
    toast.error("Please upload a PDF file first");
    return;
  }

  setIsUploading(true);
  
  try {
    // Upload PDF
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }
    
    const uploadData = await uploadResponse.json();
    
    // Generate quiz
    const quizResponse = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        uploadId: uploadData.data.uploadId,
        questionCount: 5 
      }),
    });
    
    if (!quizResponse.ok) {
      throw new Error('Quiz generation failed');
    }
    
    const quizData = await quizResponse.json();
    
    // Store quiz data
    localStorage.setItem('quizData', JSON.stringify(quizData.data));
    
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

## Deployment to Vercel

#### 1. Database Setup
Use one of these options:
- **Neon** (Recommended): Free PostgreSQL database
- **Vercel Postgres**: Integrated with Vercel
- **Railway**: Full-stack platform with database

#### 2. Environment Variables in Vercel
Add these to your Vercel project settings:
```bash
DATABASE_URL=your-database-connection-string
OPENAI_API_KEY=your-openai-api-key
```

#### 3. Deploy Command
```bash
# Build and deploy
npx vercel --prod

# Or use Vercel CLI
vercel deploy --prod
```

## Alternative: Separate Backend (if you prefer)

If you want a separate Node.js/Express backend, create a new directory:

```bash
mkdir quizgen-backend
cd quizgen-backend
npm init -y
npm install express cors helmet morgan dotenv multer pdf-parse openai pg prisma
npm install -D nodemon typescript @types/node @types/express @types/multer
```

Then follow similar patterns but with Express routes instead of Next.js API routes.

## Testing the Implementation

#### 1. Test Upload
```bash
curl -X POST -F "file=@sample.pdf" http://localhost:3000/api/upload
```

#### 2. Test Quiz Generation
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"uploadId":"your-upload-id","questionCount":5}' \
  http://localhost:3000/api/quiz/generate
```

#### 3. Test Quiz Retrieval
```bash
curl http://localhost:3000/api/quiz/your-quiz-id
```

This implementation gives you a complete backend integrated with your existing frontend, ready for a 4-hour hackathon demo!
