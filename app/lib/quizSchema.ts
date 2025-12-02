import * as z from "zod";


export const Quiz = z.object({
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
        correctOptionReasoning: z.string().min(1).optional().register(z.globalRegistry, {
            description: "A short explanation why the answer is correct, and why the other answers are incorrect.",
        }),
    })).min(1).max(20),
}).register(z.globalRegistry, {
    description: "An object that represents a quiz for student studying.",
});

export type Quiz = z.infer<typeof Quiz>;
