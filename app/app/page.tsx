"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";
import { Upload, FileText, Zap } from "lucide-react";
import { apiClient } from "@/lib/api-client";

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
    
    try {
      toast.info("Uploading and processing PDF...");
      
      // Upload PDF using API client
      const uploadResponse = await apiClient.uploadPDF(file);
      
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.error || 'Upload failed');
      }
      
      toast.info("Generating quiz with AI...");
      
      // Generate quiz using API client
      const quizResponse = await apiClient.generateQuiz(uploadResponse.data!.uploadId, 5);
      
      if (!quizResponse.success) {
        throw new Error(quizResponse.error || 'Quiz generation failed');
      }
      
      // Store quiz data for navigation
      localStorage.setItem('currentQuizId', quizResponse.data!.quizId);
      localStorage.setItem('quizData', JSON.stringify(quizResponse.data));
      
      toast.success("Quiz generated successfully!");
      router.push("/quiz");
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate quiz. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
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

        {/* <div className="mt-12 grid md:grid-cols-3 gap-6">
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
        </div> */}
      </div>
    </div>
  );
}
