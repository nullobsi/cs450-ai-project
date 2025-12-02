'use client'

import { useActionState } from 'react'
import { createQuiz } from '@/app/lib/createQuiz'
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload } from 'lucide-react';

const initialState = {
    errors: '',
}

export function QuizForm() {
    const [state, formAction, pending] = useActionState(createQuiz, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold tracking-tight">Generate Quiz</CardTitle>
                    <CardDescription className="text-base">
                        Upload your study materials or paste notes to create an AI-powered quiz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Notes
                            </Label>
                            <Textarea 
                                id="notes" 
                                name="notes" 
                                placeholder="Paste your study notes here..."
                                className="min-h-[200px] resize-y"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="files" className="text-sm font-medium flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Upload Files
                            </Label>
                            <Input
                                type="file"
                                id="files" 
                                name="files[]" 
                                accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.avif,.webp" 
                                multiple 
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, DOCX, DOC, TXT, MD, PNG, JPG, AVIF, WEBP. Max 100 MB.
                            </p>
                        </div>
                        
                        {state?.errors && (
                            <Alert variant="destructive">
                                <AlertDescription>{state.errors}</AlertDescription>
                            </Alert>
                        )}
                        
                        <Button type="submit" className="w-full" size="lg" disabled={pending}>
                            {pending ? "Generating Quiz..." : "Generate Quiz"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
