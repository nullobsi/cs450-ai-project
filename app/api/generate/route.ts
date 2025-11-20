import { InferenceClient } from "@huggingface/inference";
import {
    InferenceClientError,
    InferenceClientInputError,
    InferenceClientProviderApiError,
    InferenceClientProviderOutputError,
    InferenceClientHubApiError,
} from "@huggingface/inference";
import { Quiz } from "@/app/lib/quiz";

const model = "Qwen/Qwen3-32B";
const provider = "auto";


const systemPrompt = `
You are a backend assistant. You generate helpful, useful quizzes of an appropriate length to help the user study.
Your input is the user's class notes. Your output is a Quiz object.
`;

const json_schema = {
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
};

export async function POST(req: Request) {
    // can use Groq here
    const client = new InferenceClient(process.env.HF_TOKEN);

    const formData = await req.formData();
    const notes = formData.get('notes')?.toString();

    if (notes === undefined) return Response.json({ error: true });

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

        if (output)
            return Response.json(JSON.parse(output));

        return Response.json({ error: true });
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
        return Response.json({ error: true });
    }


}
