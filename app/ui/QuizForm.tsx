'use client'

import { useActionState } from 'react'
import { createQuiz } from '@/app/lib/createQuiz'

const initialState = {
	errors: '',
}

// https://nextjs.org/docs/app/guides/forms#validation-errors
export function QuizForm() {
	const [state, formAction, pending] = useActionState(createQuiz, initialState);

	return (
		<form action={formAction}>
			<label htmlFor='notes'>Notes</label>
			<textarea id='notes' name='notes' rows={5} cols={33} />
			<input type='file' multiple name='files[]' />
			<p aria-live='polite'>{state?.errors}</p>
			<button disabled={pending}>Create quiz!</button>
		</form>
	);
}
