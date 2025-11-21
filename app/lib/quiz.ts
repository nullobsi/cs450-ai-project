'use server';

import sql from "@/app/lib/db";
import { Quiz } from "@/app/lib/quizSchema"

/**
 * @brief Fetches a quiz from the database.
 */
export async function getQuiz(uuid: string): Promise<Quiz | undefined> {
    const quiz = await sql`
        select
           quizData
        from quiz
        where id = ${uuid}::uuid
        limit 1
    `;

    const res = quiz.at(0);
    if (res === undefined) return undefined;

    return JSON.parse(res.quizdata);
}

/**
 * @brief Adds quiz to the database.
 */
export async function addQuiz(data: Quiz): Promise<string | undefined> {
    const quiz = await sql`
        insert into quiz (quizData)
        values (${JSON.stringify(data)}::jsonb)
        returning id
    `;

    const res = quiz.at(0);

    if (res === undefined) return undefined;

    return res.id as string;
}
