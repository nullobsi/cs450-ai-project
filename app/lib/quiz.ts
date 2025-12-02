'use server';

import sql from "@/app/lib/db";
import { Quiz } from "@/app/lib/quizSchema"

/**
 * @brief Fetches a quiz from the database.
 */
export async function getQuiz(uuid: string): Promise<Quiz | undefined> {
    const quiz = await sql`
        select
           quiz_data
        from quiz
        where quiz_id = ${uuid}::uuid
        limit 1
    `;

    const res = quiz.at(0);
    if (res === undefined) return undefined;

    return JSON.parse(res.quiz_data);
}

/**
 * @brief Adds quiz to the database.
 */
export async function addQuiz(data: Quiz, note_uuid: string): Promise<string | undefined> {
    const quiz = await sql`
        insert into quiz (quiz_data, note_id)
        values (
            ${JSON.stringify(data)}::jsonb,
            ${note_uuid}::uuid
        )
        returning quiz_id
    `;

    const res = quiz.at(0);

    if (res === undefined) return undefined;

    return res.quiz_id as string;
}

export async function getAllQuizzes(): Promise<{ id: string; title: string; questionCount: number; firstQuestion: string }[]> {
    const quizzes = await sql`
        select 
            quiz_id,
            quiz_data
        from quiz
        order by quiz_id desc
    `;
    
    return quizzes.map(q => {
        const data = typeof q.quiz_data === 'string' ? JSON.parse(q.quiz_data) : q.quiz_data;
        return {
            id: q.quiz_id, 
            title: data?.title || 'Untitled Quiz',
            questionCount: data?.questions?.length || 0,
            firstQuestion: data?.questions?.[0]?.prompt || 'No preview available'
        };
    });
}
