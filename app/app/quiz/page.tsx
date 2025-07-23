"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionCard } from "@/components/question-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Eye, RotateCcw } from "lucide-react";
import { Question, QuizData, Answer } from "@/lib/types";

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showDiveDeeper, setShowDiveDeeper] = useState(false);
  const [diveDeepQuestion, setDiveDeepQuestion] = useState<Question | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedQuizData = localStorage.getItem('quizData');
    if (storedQuizData) {
      setQuizData(JSON.parse(storedQuizData));
    } else {
      toast.error("No quiz data found. Please upload a PDF first.");
      router.push("/");
    }
  }, [router]);

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }

    const answerIndex = parseInt(selectedAnswer);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    setShowFeedback(true);
    
    if (isCorrect) {
      toast.success("Correct!");
    } else {
      toast.error("Incorrect");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
      
      // Load previous answer if exists
      const prevAnswer = answers.find(a => a.questionId === quizData.questions[currentQuestionIndex - 1].id);
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.selectedAnswer.toString());
        setShowFeedback(true);
      } else {
        setSelectedAnswer("");
      }
    }
  };

  const handleDiveDeeper = (question: Question) => {
    setDiveDeepQuestion(question);
    setShowDiveDeeper(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  const goToUpload = () => {
    localStorage.removeItem('quizData');
    router.push("/");
  };

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const score = Math.round((correctAnswers / quizData.questions.length) * 100);

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-green-600">Quiz Completed!</CardTitle>
              <CardDescription className="text-xl">
                Your Score: {correctAnswers}/{quizData.questions.length} ({score}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center mb-6">
                <Button onClick={restartQuiz} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button onClick={goToUpload} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Upload New PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Quiz Summary</h2>
            {quizData.questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <Card key={question.id} className={`border-l-4 ${answer?.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {answer?.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      Question {index + 1}
                    </CardTitle>
                    <CardDescription>{question.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Your answer:</span>{" "}
                        <span className={answer?.isCorrect ? "text-green-600" : "text-red-600"}>
                          {question.options[answer?.selectedAnswer || 0]}
                        </span>
                      </p>
                      {!answer?.isCorrect && (
                        <p className="text-sm">
                          <span className="font-medium">Correct answer:</span>{" "}
                          <span className="text-green-600">
                            {question.options[question.correctAnswer]}
                          </span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDiveDeeper(question)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Dive Deeper
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Dialog open={showDiveDeeper} onOpenChange={setShowDiveDeeper}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dive Deeper: Question {diveDeepQuestion?.id}</DialogTitle>
              <DialogDescription>{diveDeepQuestion?.question}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed">{diveDeepQuestion?.diveDeeper}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          selectedAnswer={selectedAnswer}
          onAnswerChange={setSelectedAnswer}
          showFeedback={showFeedback}
          answer={currentAnswer}
        />

        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {!showFeedback ? (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                  className="flex items-center gap-2"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2"
                >
                  {currentQuestionIndex === quizData.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
