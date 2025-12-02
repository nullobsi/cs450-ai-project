'use server';

import sql from "@/app/lib/db";

/**
 * @brief Fetches a note from the database.
 */
export async function getNote(uuid: string): Promise<string | undefined> {
    const note = await sql`
        select
           note_text
        from note
        where note_id = ${uuid}::uuid
        limit 1
    `;

    const res = note.at(0);
    if (res === undefined) return undefined;

    return res.note_text;
}

/**
 * @brief Adds note to the database.
 */
export async function addNote(data: string): Promise<string | undefined> {
    const note = await sql`
        insert into note (note_text)
        values (
            ${data}
        )
        returning note_id
    `;

    const res = note.at(0);

    if (res === undefined) return undefined;

    return res.note_id as string;
}
