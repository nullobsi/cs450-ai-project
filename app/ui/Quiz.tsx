import { Quiz } from '@/app/lib/quiz';

export default async function QuizComponent({ quiz } : { quiz: Quiz }) {
	return (
		<p>{JSON.stringify(quiz)}</p>
	);
}
