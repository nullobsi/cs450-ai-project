import { getQuiz } from '@/app/lib/quiz';
import Quiz from '@/app/ui/Quiz';
import { notFound } from 'next/navigation'

export const dynamic = 'force-static';

export default async function QuizPage(props: PageProps<'/quiz/[quizId]'>) {
	const { quizId } = await props.params;

	const quiz = await getQuiz(quizId);
	if (!quiz) notFound();

	return (<Quiz quiz={quiz} />);
}
