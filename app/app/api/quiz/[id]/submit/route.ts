import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid answers format' 
      }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score and prepare results
    let score = 0;
    const results = answers.map((answer: any) => {
      const questionIndex = answer.questionId - 1;
      
      if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
        return {
          questionId: answer.questionId,
          correct: false,
          explanation: 'Invalid question',
          diveDeeper: '',
          userAnswer: answer.selectedAnswer,
          correctAnswer: -1,
        };
      }

      const question = quiz.questions[questionIndex];
      const correct = question.correctAnswer === answer.selectedAnswer;
      if (correct) score++;

      return {
        questionId: answer.questionId,
        correct,
        explanation: question.explanation,
        diveDeeper: question.diveDeeper,
        userAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
      };
    });

    // Save attempt to database
    await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        answers: answers,
        score,
      },
    });

    // Calculate percentage
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return NextResponse.json({
      success: true,
      data: {
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        results,
        message: getScoreMessage(percentage),
      },
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit quiz' 
    }, { status: 500 });
  }
}

function getScoreMessage(percentage: number): string {
  if (percentage >= 90) return 'Excellent! Outstanding performance!';
  if (percentage >= 80) return 'Great job! Well done!';
  if (percentage >= 70) return 'Good work! Keep it up!';
  if (percentage >= 60) return 'Not bad! Room for improvement.';
  return 'Keep studying! You can do better!';
}
