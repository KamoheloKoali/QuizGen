import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

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

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI("AIzaSyBkWLscQbQbibAkjEYTGrV0JWPEtODyzXM");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create prompt for quiz generation
    const prompt = `
You are an expert quiz generator. Based on the following document content, create exactly 5 multiple-choice questions.

Document Content:
${upload.extractedText.substring(0, 4000)}

Requirements:
1. Generate 5 diverse questions covering different aspects of the document
2. Each question should have 4 options (A, B, C, D)
3. Provide the correct answer index (0-3, where 0=A, 1=B, 2=C, 3=D)
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

Make sure the JSON is valid and properly formatted. Do not include any other text or markdown formatting.
`;

    // Generate quiz using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to extract JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    let aiResponse;
    try {
      aiResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (!aiResponse.questions || !Array.isArray(aiResponse.questions) || aiResponse.questions.length === 0) {
      throw new Error('Invalid quiz format from AI');
    }

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz from ${upload.originalName}`,
        uploadId: upload.id,
        totalQuestions: aiResponse.questions.length,
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
    return NextResponse.json({ 
      success: false, 
      error: 'Quiz generation failed. Please try again.' 
    }, { status: 500 });
  }
}
