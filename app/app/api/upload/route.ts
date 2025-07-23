import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { parsePDF } from '@/lib/pdf-parser';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files allowed' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Extract text from PDF
    const pdfData = await parsePDF(buffer);
    const extractedText = pdfData.text;

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 100) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unable to extract sufficient text from PDF. Please ensure the PDF contains readable text.' 
      }, { status: 400 });
    }

    // Save to database
    const upload = await prisma.upload.create({
      data: {
        filename,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        extractedText,
        uploadPath: filepath,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        uploadId: upload.id,
        filename: upload.filename,
        originalName: upload.originalName,
        extractedTextLength: upload.extractedText?.length || 0,
        processingStatus: 'completed',
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed. Please try again.' 
    }, { status: 500 });
  }
}
