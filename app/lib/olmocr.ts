'use server';
import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText } from "ai";


import { chatCompletion } from '@huggingface/inference';
import {
    InferenceClientError,
    InferenceClientInputError,
    InferenceClientProviderApiError,
    InferenceClientProviderOutputError,
    InferenceClientHubApiError,
} from "@huggingface/inference";

const model = 'allenai/olmOCR-2-7B-1025';
const systemPrompt = `
Attached is one page of a document that you must process.
Just return the plain text representation of this document as if you were reading it naturally. Convert equations to LateX and tables to HTML.
If there are any figures or charts, label them with the following markdown syntax ![Alt text describing the contents of the figure](page_startx_starty_width_height.png)
Return your output as markdown, with a front matter section on top specifying values for the primary_language, is_rotation_valid, rotation_correction, is_table, and is_diagram parameters.
`;

async function blobToBase64(blob: Blob) {
    const arrayBuf = await blob.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    const b64s = buf.toString('base64');
    return `data:${blob.type};base64,${b64s}`;
}

const deepinfra = createDeepInfra({ apiKey: process.env.DEEPINFRA_TOKEN! });

export async function olmOCR(image: Blob): Promise<string | undefined> {
    const dataUrl = await blobToBase64(image);

    try {
        const res = await generateText({
            model: deepinfra('allenai/olmOCR-2-7B-1025'),
            messages: [
                {
                    role: "user", content: [
                        { type: 'text', text: systemPrompt },
                        { type: 'image', image: dataUrl }
                    ]
                }
            ],
            maxOutputTokens: 8000,
            temperature: 0.1,
        });

        return res.text;
    } catch (error) {
        if (error instanceof InferenceClientProviderApiError) {
            // Handle API errors (e.g., rate limits, authentication issues)
            console.error("Provider API Error:", error.message);
            console.error("HTTP Request details:", error.httpRequest);
            console.error("HTTP Response details:", error.httpResponse);
            if (error instanceof InferenceClientHubApiError) {
                // Handle API errors (e.g., rate limits, authentication issues)
                console.error("Hub API Error:", error.message);
                console.error("HTTP Request details:", error.httpRequest);
                console.error("HTTP Response details:", error.httpResponse);
            } else if (error instanceof InferenceClientProviderOutputError) {
                // Handle malformed responses from providers
                console.error("Provider Output Error:", error.message);
            } else if (error instanceof InferenceClientInputError) {
                // Handle invalid input parameters
                console.error("Input Error:", error.message);
            } else {
                // Handle unexpected errors
                console.error("Unexpected error:", error);
            }
        } else {
            console.error("Unexpected error:", error);
        }

        return undefined;
    }
}
