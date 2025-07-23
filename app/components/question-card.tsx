"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle } from "lucide-react";
import { Question, Answer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerChange: (value: string) => void;
  showFeedback: boolean;
  answer?: Answer;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  showFeedback,
  answer,
  disabled = false,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Question {questionNumber}
        </CardTitle>
        <CardDescription className="text-lg">
          {question.question}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswerChange}
          disabled={disabled || showFeedback}
        >
          {question.options.map((option, index) => {
            let itemClassName = "flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition-colors";
            
            if (!showFeedback && !disabled) {
              itemClassName += " hover:bg-gray-50";
            }
            
            if (showFeedback) {
              if (index === question.correctAnswer) {
                itemClassName += " bg-green-50 border-green-300";
              } else if (index === parseInt(selectedAnswer || "")) {
                itemClassName += " bg-red-50 border-red-300";
              } else {
                itemClassName += " bg-gray-50";
              }
            } else if (selectedAnswer === index.toString()) {
              itemClassName += " bg-blue-50 border-blue-300";
            }

            return (
              <label key={index} className={cn(itemClassName)}>
                <RadioGroupItem value={index.toString()} />
                <span className="flex-1">{option}</span>
                {showFeedback && index === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && 
                 index === parseInt(selectedAnswer || "") && 
                 index !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </label>
            );
          })}
        </RadioGroup>

        {showFeedback && (
          <Card className={cn(
            "border-l-4",
            answer?.isCorrect ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"
          )}>
            <CardContent className="pt-4">
              <p className="font-medium mb-2 text-sm">
                {answer?.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
