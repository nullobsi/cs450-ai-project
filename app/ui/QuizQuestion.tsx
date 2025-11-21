'use client';
import { arrayToShuffled } from "@/app/lib/util";
import { useState } from 'react';

interface QuizQuestionParams {
    prompt: string,
    correctAnswer: string,
    incorrectAnswers: string[],
    permutation: number[],
};

async function questionClick(correct: boolean) {
    console.log(correct);
}

export default function QuizQuestion({ prompt, correctAnswer, incorrectAnswers, permutation }: QuizQuestionParams) {
    const [state, setState] = useState({
        selected: 'none',
    });
    const options = [
        { correct: true, body: correctAnswer, key: `correct` },
        ... (incorrectAnswers.map((o, n) => ({ correct: false, body: o, key: `${n}` })))
    ];
    const shuffledOptions = [];
    for (const n of permutation) {
        shuffledOptions.push(options[n]);
    }



    return (
        <section>
            <p className="mt-2 text-lg font-normal text-body">{prompt}</p>
            <ul>
                {shuffledOptions.map((o, i) => {
                    let classes = "bg-transparent font-semibold py-2 px-4 border hover:border-transparent rounded";
                    if (state.selected === o.key && o.correct) {
                        classes += ' hover:bg-green-500 text-green-700 hover:text-white border-green-500';
                    } else if (state.selected === o.key) {
                        classes += ' hover:bg-red-500 text-red-700 hover:text-white border-red-500';
                    } else {
                        classes += ' hover:bg-blue-500 text-blue-700 hover:text-white border-blue-500';
                    }

                    return (
                        <li className={classes} key={o.key} onClick={() => setState({ selected: o.key })}>
                            {o.body}
                        </li>
                    )
                })}
            </ul>
        </section>
    );
}
