#!/bin/bash

# QuizGen API Test Script
echo "🚀 Testing QuizGen API Endpoints"
echo "================================="

API_BASE="http://localhost:3000/api"

echo "📤 Testing Upload Endpoint..."
echo "curl -X POST -F \"file=@sample.pdf\" $API_BASE/upload"
echo ""

echo "🧠 Testing Quiz Generation..."
echo "curl -X POST -H \"Content-Type: application/json\" \\"
echo "  -d '{\"uploadId\":\"YOUR_UPLOAD_ID\",\"questionCount\":5}' \\"
echo "  $API_BASE/quiz/generate"
echo ""

echo "📖 Testing Quiz Retrieval..."
echo "curl $API_BASE/quiz/YOUR_QUIZ_ID"
echo ""

echo "✅ Testing Quiz Submission..."
echo "curl -X POST -H \"Content-Type: application/json\" \\"
echo "  -d '{\"answers\":[{\"questionId\":1,\"selectedAnswer\":0}]}' \\"
echo "  $API_BASE/quiz/YOUR_QUIZ_ID/submit"
echo ""

echo "💡 Instructions:"
echo "1. Replace YOUR_UPLOAD_ID with actual upload ID"
echo "2. Replace YOUR_QUIZ_ID with actual quiz ID"
echo "3. Ensure Gemini API key is set in .env.local"
echo "4. Ensure database is running and connected"
