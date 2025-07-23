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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF file selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      toast.success("PDF file uploaded successfully!");
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {file ? file.name : "Drop your PDF here or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF files up to 10MB
              </p>
              <Input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-green-600">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={generateQuiz}
              disabled={!file || isUploading}
              className="w-full h-12 text-lg"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
