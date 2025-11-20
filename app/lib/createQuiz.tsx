'use server';

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { InferenceClient } from "@huggingface/inference";
import {
    InferenceClientError,
    InferenceClientInputError,
    InferenceClientProviderApiError,
    InferenceClientProviderOutputError,
    InferenceClientHubApiError,
} from "@huggingface/inference";
import { addQuiz, Quiz } from "@/app/lib/quiz";

const model = "moonshotai/Kimi-K2-Instruct-0905";
const provider = "auto";

const genericErrorMessage = 'An error occured!';


const systemPrompt = `
You are a backend assistant. You generate helpful, useful quizzes of an appropriate length to help the user study.
Your input is the user's class notes. Your output is a Quiz object.
`;

const json_schema = {
    "properties": {
        "questions": {
            "items": {
                "properties": {
                    "prompt": {
                        "description": "Multiple choice question prompt.",
                        "type": "string"
                    },
                    "correctOption": {
                        "description": "The only correct answer for the multiple choice question..",
                        "type": "string"
                    },
                    "incorrectOptions": {
                        "description": "List of incorrect answers for the multiple choice question.",
                        "items": {
                            "type": "string"
                        },
                        "type": "array"
                    }
                },
                "type": "object"
            },
            "type": "array"
        },
        "title": {
            "type": "string"
        }
    },
    "type": "object"
};

export async function createQuiz(initialState: any, formData: FormData) {
    // can use Groq here
    const client = new InferenceClient(process.env.HF_TOKEN); // Either a HF access token, or an API key from the third-party provider

    const notes = formData.get('notes')?.toString();
    let id: string | undefined = undefined;

    if (notes === undefined) return { errors: 'Notes are blank!' };

    try {
        const out = await client.chatCompletion({
            model,
            provider,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: formData.get('notes')?.toString() },
            ],
            max_tokens: 512,
            temperature: 0.1,
            response_format: {
                json_schema: {
                    description: 'An object representing a quiz for studying.',
                    name: 'Quiz',
                    schema: json_schema,
                    strict: true,
                },
                type: 'json_schema',
            }
        });

        console.log(out.choices[0].message.content);
        const output = out.choices[0].message.content;


        if (output) {
            const quiz = JSON.parse(output) as Quiz;
            id = await addQuiz(quiz);
        }
        else {
            return { errors: genericErrorMessage };
        }

    } catch (error) {
        // https://nextjs.org/docs/app/guides/forms#validation-errors
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
        return { errors: genericErrorMessage };
    }

    // https://nextjs.org/docs/app/guides/redirecting
    if (id)
        redirect(`/quiz/${id}`);
    else
        return { errors: genericErrorMessage };
}
