'use server';

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import * as z from "zod";
import { createHuggingFace } from '@ai-sdk/huggingface';
import { generateObject } from 'ai';
import { addQuiz } from "@/app/lib/quiz";
import { pdfToText } from '@/app/lib/pdf';

/************
 * TUNABLES *
 ************/

// The model and provider must support structured output.
const model = "moonshotai/Kimi-K2-Instruct-0905";
const maxOutputTokens = 8192;
const temperature = 0.1;

const genericErrorMessage = 'An error occured!';

const systemPrompt = `
You are a backend assistant. You generate helpful, useful quizzes of an appropriate length to help the user study.
Your input is the user's class notes. Your output is a Quiz object. You must include 'Quiz' in the title.
`;

const QuizSchema = z.object({
    title: z.string().min(1),
    questions: z.array(z.object({
        prompt: z.string().min(1).register(z.globalRegistry, {
            description: "Multiple choice question prompt.",
        }),
        correctOption: z.string().min(1).register(z.globalRegistry, {
            description: "The only correct answer for the multiple choice question.",
        }),
        incorrectOptions: z.array(z.string()).min(1).register(z.globalRegistry, {
            description: "List of incorrect answers for the multiple choice question.",
        }),
    })).min(1).max(20),
}).register(z.globalRegistry, {
    description: "An object that represents a quiz for student studying.",
});

// Use HuggingFace token.
const huggingFace = createHuggingFace({
    apiKey: process.env.HF_TOKEN!,
});

/**
 * Server action.
 * @brief Generates a Quiz object and stores it in the database.
 * Redirects to the quiz if successful.
 * @param formData Form data from submission. Can have text 'notes' or
 * multiple files under 'files[]', which should be in PDF or PNG
 * format.
 * @returns New state containing an error if quiz could not be
 * generated.
 */
export async function createQuiz(initialState: any, formData: FormData) {
    // Notes can be blank if just files are uploaded.
    let notes = formData.get('notes')?.toString() || '';

    // Get files
    const files = formData.getAll('files[]');

    // TODO: Handle PNG images directly into olmOCR.
    // TODO: Resize images to the size that olmOCR expects.
    // Asynchronously convert all PDFs to Markdown.
    const pdfText = await Promise.all(
        // files => filter to just Blobs => filter only PDFs => convert to Markdown
        files.filter(f => f instanceof Blob).filter(f => f.type == 'application/pdf').map(pdfToText)
    );
    // Add generated text to notes.
    notes += pdfText.flat().join('\n');

    // Error out early.
    if (notes === undefined || notes == '') return { errors: 'Notes are blank!' };

    // XXX
    console.log(notes);

    // Final result variable.
    let id: string | undefined = undefined;

    try {
        // Call out to LLM to generate quiz.
        const res = await generateObject({
            model: huggingFace(model),
            maxOutputTokens,
            temperature,
            schema: QuizSchema,
            system: systemPrompt,
            prompt: notes,
            schemaName: "Quiz",
            schemaDescription: "An object that represents a quiz for student studying.",
        });

        if (res) {
            id = await addQuiz(res.object);
        }
        else {
            return { errors: genericErrorMessage };
        }

    } catch (error) {
        console.error("Unexpected error:", error);
        return { errors: genericErrorMessage };
    }

    // https://nextjs.org/docs/app/guides/redirecting
    if (id) {
        revalidatePath(`/quiz/${id}`, 'page');
        redirect(`/quiz/${id}`);
    }
    else
        return { errors: genericErrorMessage };
}
