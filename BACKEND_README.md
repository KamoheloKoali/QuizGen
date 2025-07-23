# QuizGen Backend - MVP Implementation

## 🚀 Overview

This is the MVP backend implementation for QuizGen using:
- **Next.js API Routes** for backend endpoints
- **Gemini AI** for quiz generation (instead of OpenAI)
- **Prisma + PostgreSQL** for data persistence
- **No user authentication** (simplified for MVP)

## 📁 Project Structure

```
app/
├── api/
│   ├── upload/
│   │   └── route.ts              # PDF upload & text extraction
│   └── quiz/
│       ├── generate/
│       │   └── route.ts          # Quiz generation with Gemini
│       └── [id]/
│           ├── route.ts          # Get quiz by ID
│           └── submit/
│               └── route.ts      # Submit quiz answers
├── lib/
│   ├── prisma.ts                 # Database connection
│   └── types.ts                  # TypeScript types
└── prisma/
    └── schema.prisma             # Database schema
```

## 🗄️ Database Schema

### Tables:
- **Upload** - Stores PDF files and extracted text
- **Quiz** - Quiz metadata linked to uploads
- **Question** - Individual quiz questions with options
- **QuizAttempt** - Anonymous quiz attempts and scores

## 🛠️ API Endpoints

### 1. Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data

Form Data:
- file: PDF file (max 10MB)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "cuid",
    "filename": "timestamp-filename.pdf",
    "originalName": "document.pdf",
    "extractedTextLength": 5000,
    "processingStatus": "completed"
  }
}
```

### 2. Generate Quiz
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "uploadId": "upload_id",
  "questionCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quizId": "quiz_id",
    "title": "Quiz from document.pdf",
    "questions": [
      {
        "id": 1,
        "question": "What is...?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation",
        "diveDeeper": "Extended explanation"
      }
    ]
  }
}
```

### 3. Get Quiz
```http
GET /api/quiz/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quizId": "quiz_id",
    "title": "Quiz title",
    "questions": [...],
    "sourceDocument": "document.pdf",
    "createdAt": "2025-01-23T..."
  }
}
```

### 4. Submit Quiz
```http
POST /api/quiz/{id}/submit
Content-Type: application/json

{
  "answers": [
    {
      "questionId": 1,
      "selectedAnswer": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 4,
    "totalQuestions": 5,
    "percentage": 80,
    "results": [...],
    "message": "Great job! Well done!"
  }
}
```

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
cd app/
pnpm install
```

### 2. Environment Variables
Create `app/.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quizgen"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create/update database schema
npx prisma db push

# (Optional) View database
npx prisma studio
```

### 4. Start Development Server
```bash
pnpm dev
```

## 🧪 Testing

### Manual Testing
```bash
# Test upload
curl -X POST -F "file=@sample.pdf" http://localhost:3000/api/upload

# Test quiz generation
curl -X POST -H "Content-Type: application/json" \
  -d '{"uploadId":"YOUR_UPLOAD_ID","questionCount":5}' \
  http://localhost:3000/api/quiz/generate

# Test quiz retrieval
curl http://localhost:3000/api/quiz/YOUR_QUIZ_ID

# Test quiz submission
curl -X POST -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"selectedAnswer":0}]}' \
  http://localhost:3000/api/quiz/YOUR_QUIZ_ID/submit
```

## 🔒 Security Features

- **File validation** - Only PDF files, max 10MB
- **Text extraction validation** - Minimum text length required
- **Input sanitization** - All inputs validated
- **Error handling** - Comprehensive error responses
- **Database connection pooling** - Optimized Prisma setup

## 🚀 Deployment

### Vercel (Recommended)
1. Connect to GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Environment Variables for Production:
```env
DATABASE_URL=your-production-database-url
GEMINI_API_KEY=your-gemini-api-key
```

## 📋 MVP Features Implemented

✅ **PDF Upload & Processing**
- File upload with validation
- Text extraction using pdf-parse
- Storage in database

✅ **AI Quiz Generation**
- Gemini AI integration
- Structured prompt for consistent output
- JSON parsing and validation

✅ **Quiz Management**
- Store quizzes in database
- Retrieve quiz by ID
- Question ordering

✅ **Quiz Submission & Scoring**
- Anonymous quiz attempts
- Real-time scoring
- Detailed feedback with explanations

## 🔄 Future Enhancements

- User authentication and profiles
- Quiz sharing and collaboration
- Advanced analytics and reporting
- Support for more file formats
- Bulk quiz generation
- Custom question templates

## 🐛 Troubleshooting

### Common Issues:
1. **Database connection errors** - Check DATABASE_URL
2. **Gemini API errors** - Verify GEMINI_API_KEY
3. **PDF parsing fails** - Ensure PDF contains readable text
4. **File upload limits** - Check server upload limits

### Debug Mode:
Check server logs for detailed error messages during development.
