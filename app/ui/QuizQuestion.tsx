'use client';
import { arrayToShuffled } from "@/app/lib/util";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestionParams {
    prompt: string,
    correctAnswer: string,
    incorrectAnswers: string[],
    permutation: number[],
    reasoning?: string,
    onAnswer?: (correct: boolean) => void,
};

async function questionClick(correct: boolean) {
    console.log(correct);
}

export default function QuizQuestion({ prompt, correctAnswer, incorrectAnswers, permutation, reasoning, onAnswer }: QuizQuestionParams) {
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

    const handleClick = (key: string, correct: boolean) => {
        if (state.selected === 'none') {
            setState({ selected: key });
            onAnswer?.(correct);
        }
    };

    const answered = state.selected !== 'none';

    return (
        <Card className="p-6 space-y-4">
            <h3 className="text-lg font-medium leading-relaxed">{prompt}</h3>
            <div className="space-y-2">
                {shuffledOptions.map((o, i) => {
                    const isSelected = state.selected === o.key;
                    const isCorrect = o.correct;
                    const showResult = isSelected;

                    return (
                        <Button
                            key={o.key}
                            onClick={() => handleClick(o.key, o.correct)}
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left h-auto py-3 px-4 transition-all",
                                !showResult && "hover:bg-accent hover:text-accent-foreground",
                                showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900",
                                showResult && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900"
                            )}
                        >
                            <span className="flex items-center gap-3 flex-1">
                                {!showResult && <Circle className="h-5 w-5 flex-shrink-0" />}
                                {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />}
                                {showResult && !isCorrect && <XCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />}
                                <span className="flex-1 text-wrap">{o.body}</span>
                            </span>
                        </Button>
                    )
                })}
            </div>
            {answered && reasoning && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong className="font-semibold">Explanation: </strong>
                        {reasoning}
                    </p>
                </div>
            )}
        </Card>
    );
}
