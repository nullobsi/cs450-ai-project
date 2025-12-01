import { getAllQuizzes } from '@/app/lib/quiz';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default async function MyQuizzesPage() {
    const quizzes = await getAllQuizzes();

    return (
        <div className="container mx-auto p-8 pt-16">
            <h1 className="text-4xl font-bold mb-6">My Quizzes</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map(quiz => (
                    <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader>
                                <CardTitle>{quiz.title}</CardTitle>
                                <CardDescription>{quiz.questionCount} questions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {quiz.firstQuestion}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
            {quizzes.length === 0 && (
                <p className="text-muted-foreground text-center mt-8">No quizzes yet. Create your first quiz!</p>
            )}
        </div>
    );
}
