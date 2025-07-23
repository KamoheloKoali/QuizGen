"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
}

export function FileUpload({ onFileSelect, selectedFile, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
      toast.success("PDF file selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
      toast.success("PDF file uploaded successfully!");
    } else {
      toast.error("Please upload a valid PDF file");
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400",
          selectedFile && "border-green-400 bg-green-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {selectedFile ? (
          <FileText className="h-12 w-12 mx-auto text-green-500 mb-4" />
        ) : (
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        )}
        
        <p className="text-lg font-medium text-gray-700 mb-2">
          {selectedFile ? selectedFile.name : "Drop your PDF here or click to browse"}
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

      {selectedFile && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-800">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-sm text-green-600">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
