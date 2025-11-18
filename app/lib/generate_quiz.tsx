'use server'

import { InferenceClient } from "@huggingface/inference";
import {
    InferenceClientError,
    InferenceClientInputError,
    InferenceClientProviderApiError,
    InferenceClientProviderOutputError,
    InferenceClientHubApiError,
} from "@huggingface/inference";

const model = "Qwen/Qwen3-32B";
const provider = "auto";


export async function generateQuiz(formData: FormData) {
    // can use Groq here
    const client = new InferenceClient('API KEY HERE');

    try {
        const result = await client.textGeneration({
            model: "gpt2",
            inputs: "Hello, I'm a language model",
        });
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
        }
        return false;
    }

    const out = await client.chatCompletion({
        model,
        provider,
        messages: [
            { role: "system", content: "You are a backend assistant. You generate helpful, useful quizzes of appropriate length to help study." },
            { role: "user", content: formData.get('notes')?.toString() },
        ],
        max_tokens: 512,
        temperature: 0.1,
        response_format: {
            json_schema: {
                description: 'An object representing a quiz for studying.',
                name: 'Quiz',
                schema: {
                    "properties": {
                        "questions": {
                            "items": {
                                "properties": {
                                    "correctOption": {
                                        "type": "string"
                                    },
                                    "incorrectOptions": {
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
                },
                string: true,
            },
            type: 'json_schema',
        }
    });

    const output = out.choices[0].message.content;

    if (output)
        return JSON.parse(output);

    return undefined;
}
