'use server';

import { JSONValue } from "postgres";
import sql from "./db";

export interface Quiz {
    title: string,
    questions: { incorrectOptions: string[], correctOption: string }[]
};

export async function getQuiz(uuid: string) : Promise<Quiz | undefined> {
	const quiz = await sql`
		select
			quizJson
		from quiz
		where id = ${uuid}
		limit 1
	`;

	const res = quiz.at(0);
	if (res === undefined) return undefined;
	
	return res.quizJson;
}

export async function addQuiz(data: Quiz) : Promise<string | undefined> {
	const quiz = await sql`
		insert into quiz (quizJson)
		values (${JSON.stringify(data)}::jsonb)
		returning id
	`;

	const res = quiz.at(0);

	if (res === undefined) return undefined;

	return res.id as string;
}
