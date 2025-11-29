'use client';
import { useState } from 'react';
import QuizQuestion from './QuizQuestion';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export function QuizWrapper({ questions }: { questions: any[] }) {
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const [key, setKey] = useState(0);
    const correct = Object.values(answers).filter(Boolean).length;
    const total = Object.keys(answers).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    const retake = () => {
        setAnswers({});
        setKey(prev => prev + 1);
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 backdrop-blur-xl bg-background/80 border rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-2xl">{pct}%</span>
                    <span className="text-muted-foreground">{total}/{questions.length}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={retake} className="h-8 w-8 rounded-full">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-6" key={key}>
                {questions.map(q => 
                    <QuizQuestion 
                        {...q} 
                        onAnswer={(correct: boolean) => setAnswers(prev => ({ ...prev, [q.key]: correct }))}
                    />
                )}
            </div>
        </>
    );
}
