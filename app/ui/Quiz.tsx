import { Quiz } from '@/app/lib/quizSchema';
import { QuizWrapper } from './QuizWrapper';


function arrayShuffle<T>(array: Array<T>): Array<T> {
    if (!Array.isArray(array)) {
        throw new TypeError(`Expected an array, got ${typeof array}`);
    }

    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }

    return array;
}

function arrayToShuffled<T>(array: Array<T>): Array<T> {
    if (!Array.isArray(array)) {
        throw new TypeError(`Expected an array, got ${typeof array}`);
    }

    if (array.length === 0) {
        return [];
    }

    return arrayShuffle([...array]);
}

export default async function QuizComponent({ quiz }: { quiz: Quiz }) {
    console.log(quiz);
    const shuffled_quiz = {
        title: quiz.title,
        questions: arrayToShuffled(quiz.questions.map((q, i) => ({
            prompt: q.prompt,
            key: `q${i}`,
            correctAnswer: q.correctOption,
            incorrectAnswers: q.incorrectOptions,
            reasoning: q.correctOptionReasoning,
            permutation: arrayToShuffled([...Array(1 + q.incorrectOptions.length).keys()])
        })))
    };

    return (
        <div>
            <h1 className='mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl'>{shuffled_quiz.title}</h1>
            <QuizWrapper questions={shuffled_quiz.questions} />
        </div>
    );
}
