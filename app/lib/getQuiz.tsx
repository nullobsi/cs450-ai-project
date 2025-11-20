'use client';

import { Quiz } from "@/app/lib/quiz";

export async function getQuiz(notes: string) : Promise<Quiz | false> {
	const formData = new FormData();

	formData.set('notes', notes);

	const resp = await fetch('/api/generate', {
		method: "POST",
		body: formData,
	});

	const quiz: Quiz = await resp.json();

	return quiz;
}
