'use server'; 
import mammoth from 'mammoth';

/* Extract text from a DOCX file */

// `export` makes the function callable from other files
// `async` contains asynchronous operations like await 
// A `blob` represents binary large object, typically a file
// A `promise` is a placeholder for a value that will be available in the future
// The function returns a promise that resolves to a string or undefined
export async function docxToText(file: Blob): Promise<string|undefined> {
    try {
        // Convert blob to array buffer
        // An array buffer is a chunk of raw binary data stored in memory 
        // We want to use array buffer because mammoth need the raw binary bytes in order to parse 
        const arrayBuffer = await file.arrayBuffer();
        
        // Convert ArrayBuffer to Buffer (mammoth expects Node.js Buffer)
        const buffer = Buffer.from(arrayBuffer);

        // Use mammoth to extract the text 
        const result = await mammoth.extractRawText({
            buffer: buffer
        }); 

        // If there are any messages from mammoth, log them for debugging
        if (result.messages.length > 0) {
            console.warn("Mammoth messages:", result.messages);
        }

        return result.value; 

    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        return undefined;
    }
}