import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id: id },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
        },
        upload: {
          select: {
            originalName: true,
            createdAt: true,
          },
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
        sourceDocument: quiz.upload.originalName,
        createdAt: quiz.createdAt,
      },
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch quiz' 
    }, { status: 500 });
  }
}
