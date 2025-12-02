'use server';

import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText } from "ai";
import pLimit from 'p-limit';

/************
 * TUNABLES *
 ************/
// 20 concurrent requests to the endpoint max.
const parallelRequests = 20;

// This is a new model that is very good at documents.
const model = 'allenai/olmOCR-2-7B-1025';
const maxOutputTokens = 8000;
const temperature = 0.1; // Generally should be low for OCR.

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

const limit = pLimit(parallelRequests);

/**
 * @brief Converts an image of a document into Markdown text.
 * @param image Should be a PNG encoded image with the largest dimension
 * being 1288px.
 * @returns The text.
 * @throws
 */
export async function olmOCR(image: Blob): Promise<string> {
    const dataUrl = await blobToBase64(image);

    const res = await limit(generateText, {
        model: deepinfra(model),
        messages: [
            {
                role: "user", content: [
                    { type: 'text', text: systemPrompt },
                    { type: 'image', image: dataUrl }
                ]
            }
        ],
        maxOutputTokens,
        temperature,
    });

    return res.text;
}
