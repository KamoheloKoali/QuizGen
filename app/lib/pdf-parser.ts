// PDF parsing utility
import PDFParse from 'pdf-parse-debugging-disabled';

export async function parsePDF(buffer: Buffer): Promise<{ text: string }> {
  try {
    const data = await PDFParse(buffer);
    
    if (!data || !data.text) {
      throw new Error('No text extracted from PDF');
    }
    
    return { text: data.text };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure the PDF contains readable text and is not corrupted.');
  }
}
