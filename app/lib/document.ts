'use server';
import { pdfToText } from '@/app/lib/doctypes/pdf';
import { docxToText } from '@/app/lib/doctypes/docx';
import { imageToText } from '@/app/lib/doctypes/image';

const acceptableImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
];

export async function extractTextFromDocument(file: File): Promise<{
    text?: string;
    error?: string;
}> {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    try {
        // Handle TXT and MD files
        if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileType == 'text/plain') {
            const text = await file.text();
            return { text };
        }

        // Handle PDF files
        if (fileType == "application/pdf") {
            const pdfResults = await pdfToText(file);
            return { text: pdfResults.join('\n\n') };
        }

        // Handle DOCX files
        if (fileName.endsWith('.docx')) {
            const text = await docxToText(file);
            return { text };
        }

        if (acceptableImageMimeTypes.includes(fileType)) {
            const text = await imageToText(file);
            return { text };
        }

        // Unsupported file type
        return { error: `Unsupported file type. Please use PDF, DOCX, TXT, or image files.` };

    } catch (error) {
        console.error('Error processing file:', error);
        return { error: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
