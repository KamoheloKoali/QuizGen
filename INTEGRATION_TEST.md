# Frontend-Backend Integration Test Guide

## 🧪 Testing the Complete Integration

### 1. Start the Development Server

```bash
cd /home/bad-dev/QuizGen/app
pnpm dev
```

The server should start at `http://localhost:3000`

### 2. Manual Testing Steps

#### Step 1: Upload PDF Test
1. Open `http://localhost:3000`
2. Upload a PDF file (any PDF with readable text)
3. Click "Generate Quiz"
4. Verify:
   - ✅ Upload progress shows
   - ✅ "Uploading and processing PDF..." toast appears
   - ✅ "Generating quiz with AI..." toast appears
   - ✅ Redirects to quiz page

#### Step 2: Quiz Generation Test
1. On quiz page, verify:
   - ✅ Quiz title shows "Quiz from [filename]"
   - ✅ 5 questions are generated
   - ✅ Each question has 4 options
   - ✅ Questions are relevant to PDF content

#### Step 3: Quiz Taking Test
1. Answer all questions
2. Verify:
   - ✅ Immediate feedback on each answer
   - ✅ Progress indicator updates
   - ✅ Can navigate between questions

#### Step 4: Quiz Submission Test
1. Complete the quiz
2. Verify:
   - ✅ Quiz submitted to backend automatically
   - ✅ Score calculated and displayed
   - ✅ Percentage and message shown
   - ✅ Can retake quiz or upload new PDF

### 3. API Testing with curl

#### Test Upload Endpoint
```bash
curl -X POST -F "file=@sample.pdf" http://localhost:3000/api/upload
```

Expected response:
```json
{
  "success": true,
  "data": {
    "uploadId": "cuid123...",
    "filename": "timestamp-sample.pdf",
    "originalName": "sample.pdf",
    "extractedTextLength": 5000,
    "processingStatus": "completed"
  }
}
```

#### Test Quiz Generation
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"uploadId":"YOUR_UPLOAD_ID","questionCount":5}' \
  http://localhost:3000/api/quiz/generate
```

Expected response:
```json
{
  "success": true,
  "data": {
    "quizId": "quiz123...",
    "title": "Quiz from sample.pdf",
    "questions": [...]
  }
}
```

#### Test Quiz Retrieval
```bash
curl http://localhost:3000/api/quiz/YOUR_QUIZ_ID
```

#### Test Quiz Submission
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":1,"selectedAnswer":0}]}' \
  http://localhost:3000/api/quiz/YOUR_QUIZ_ID/submit
```

### 4. Database Verification

Check if data is being stored correctly:

```bash
cd /home/bad-dev/QuizGen/app
npx prisma studio
```

Verify tables contain data:
- **Upload** - PDF files and extracted text
- **Quiz** - Generated quizzes
- **Question** - Individual questions
- **QuizAttempt** - Submitted quiz attempts

### 5. Error Testing

#### Test Invalid File Upload
1. Try uploading non-PDF file
2. Try uploading file > 10MB
3. Verify appropriate error messages

#### Test API Errors
1. Call APIs with invalid data
2. Verify error handling in frontend

### 6. Performance Testing

#### Load Testing (Optional)
```bash
# Install apache bench
sudo apt-get install apache2-utils

# Test upload endpoint
ab -n 10 -c 2 -p sample.pdf -T multipart/form-data http://localhost:3000/api/upload
```

## 🔧 Environment Variables Checklist

Ensure these are set in `.env.local`:

```bash
# Database Connection
DATABASE_URL="postgresql://..." ✅

# Gemini AI API Key  
GEMINI_API_KEY="your-key-here" ✅

# Frontend API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api" ✅

# File Upload Limit
NEXT_PUBLIC_MAX_FILE_SIZE=10485760 ✅
```

## 🐛 Common Issues & Solutions

### Issue: PDF parsing fails
**Solution**: Ensure PDF contains readable text, not just images

### Issue: Gemini API errors
**Solution**: 
1. Check API key is valid
2. Ensure you have API credits/quota
3. Check network connectivity

### Issue: Database connection errors
**Solution**:
1. Verify DATABASE_URL is correct
2. Check database is running
3. Run `npx prisma db push` to sync schema

### Issue: Build fails
**Solution**:
1. Check TypeScript errors
2. Ensure all imports are correct
3. Run `npx prisma generate` to update client

## ✅ Success Criteria

The integration is successful when:

1. **Upload Flow**: PDF uploads and text extraction works
2. **AI Generation**: Gemini creates relevant quiz questions
3. **Database Storage**: All data persists correctly
4. **Frontend Integration**: Smooth user experience
5. **Error Handling**: Graceful error messages
6. **Performance**: Reasonable response times

## 🚀 Next Steps

After successful testing:

1. **Deploy to production** (Vercel recommended)
2. **Set up monitoring** (error tracking, analytics)
3. **Add user authentication** (if needed)
4. **Implement quiz sharing** (future feature)
5. **Add analytics dashboard** (quiz statistics)
