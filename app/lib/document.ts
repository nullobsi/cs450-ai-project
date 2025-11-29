'use server';
import { pdfToText } from './pdf';
import { docxToText } from './docx';

export async function extractTextFromDocument(file: File): Promise<{
    text?: string;
    error?: string;
}> {
    const fileName = file.name.toLowerCase();
    
    try {
        // Handle PDF files
        if (fileName.endsWith('.pdf')) {
            const pdfResults = await pdfToText(file);
            return { text: pdfResults.join('\n\n') };
        }
        
        // Handle DOCX files
        if (fileName.endsWith('.docx')) {
            const text = await docxToText(file);
            return { text };
        }
        
        // Unsupported file type
        return { error: `Unsupported file type. Please use PDF or DOCX files.` };
        
    } catch (error) {
        console.error('Error processing file:', error);
        return { error: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
