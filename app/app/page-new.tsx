"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";
import { Upload, FileText, Zap } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const generateQuiz = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first");
      return;
    }

    setIsUploading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store quiz data in localStorage for demo
      const mockQuizData = {
        title: `Quiz from ${file.name}`,
        questions: [
          {
            id: 1,
            question: "What is the main topic discussed in the document?",
            options: ["Topic A", "Topic B", "Topic C", "Topic D"],
            correctAnswer: 0,
            explanation: "The document primarily focuses on Topic A as outlined in the introduction.",
            diveDeeper: "Topic A encompasses several key concepts including foundational principles, practical applications, and future implications. The document explores these aspects in detail, providing case studies and examples that demonstrate real-world applications."
          },
          {
            id: 2,
            question: "According to the document, what is the most important factor?",
            options: ["Factor 1", "Factor 2", "Factor 3", "Factor 4"],
            correctAnswer: 1,
            explanation: "Factor 2 is identified as the most critical element based on the research presented.",
            diveDeeper: "Factor 2 plays a crucial role because it influences multiple other variables in the system. The document presents extensive research showing how this factor impacts outcomes, with statistical evidence and expert opinions supporting its importance."
          },
          {
            id: 3,
            question: "What methodology was used in the study?",
            options: ["Quantitative", "Qualitative", "Mixed Methods", "Experimental"],
            correctAnswer: 2,
            explanation: "The study employed a mixed methods approach combining both quantitative and qualitative techniques.",
            diveDeeper: "The mixed methods approach was chosen to provide a comprehensive understanding of the phenomenon. This methodology allowed researchers to capture both numerical data and contextual insights, leading to more robust conclusions."
          },
          {
            id: 4,
            question: "What are the key findings mentioned?",
            options: ["Finding A", "Finding B", "Finding C", "All of the above"],
            correctAnswer: 3,
            explanation: "The document presents multiple key findings, including Finding A, B, and C.",
            diveDeeper: "These findings represent significant contributions to the field. Finding A addresses the theoretical framework, Finding B provides practical insights, and Finding C suggests future research directions. Together, they form a comprehensive understanding of the subject matter."
          },
          {
            id: 5,
            question: "What is the conclusion of the document?",
            options: ["Conclusion 1", "Conclusion 2", "Conclusion 3", "Conclusion 4"],
            correctAnswer: 0,
            explanation: "The document concludes with Conclusion 1, summarizing the main arguments presented.",
            diveDeeper: "Conclusion 1 synthesizes all the evidence presented throughout the document. It addresses the original research questions, discusses limitations, and provides recommendations for future work. The conclusion also highlights the broader implications of the findings for the field."
          }
        ]
      };
      
      localStorage.setItem('quizData', JSON.stringify(mockQuizData));
      
      toast.success("Quiz generated successfully!");
      router.push("/quiz");
    } catch (error) {
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            QuizGen
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Transform your PDFs into interactive quizzes instantly
          </p>
          <p className="text-gray-500">
            Upload a PDF document and get a personalized 5-question quiz with detailed feedback
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload PDF Document
            </CardTitle>
            <CardDescription>
              Upload a PDF file to generate a custom quiz with 5 multiple-choice questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              onFileSelect={setFile}
              selectedFile={file}
            />

            <Button
              onClick={generateQuiz}
              disabled={!file || isUploading}
              className="w-full h-12 text-lg"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                  Generating Quiz...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Generate Quiz
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Upload className="h-8 w-8 mx-auto text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">1. Upload PDF</h3>
              <p className="text-sm text-gray-600">
                Simply drag and drop or select your PDF document
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 mx-auto text-yellow-500 mb-3" />
              <h3 className="font-semibold mb-2">2. Generate Quiz</h3>
              <p className="text-sm text-gray-600">
                AI analyzes your document and creates 5 targeted questions
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 mx-auto text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">3. Take Quiz</h3>
              <p className="text-sm text-gray-600">
                Answer questions and get instant feedback with explanations
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
