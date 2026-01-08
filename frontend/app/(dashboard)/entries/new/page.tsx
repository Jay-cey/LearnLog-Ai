'use client';

import { useEntries } from "@/hooks/useEntries";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import clsx from "clsx";
// import toast from "react-hot-toast";

type FormValues = {
    content: string;
};

export default function NewEntryPage() {
    const router = useRouter();
    const { createEntry } = useEntries("user-id-placeholder"); // TODO: real user id
    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
    const [aiFeedback, setAiFeedback] = useState<{ type: 'error' | 'success', message: string, detail?: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setIsAnalyzing(true);
        setAiFeedback(null);
        try {
            await createEntry.mutateAsync({
                content: data.content,
                date: new Date().toISOString().split('T')[0],
            });
            router.push('/entries');
        } catch (error: any) {
            console.error(error);
            const detail = error.message;
            // Rudimentary check if it's our AI validation error (usually comes as stringified JSON or detail object if typed)
            // For now assuming the API throws a readable error message

            setAiFeedback({
                type: 'error',
                message: 'AI Validation Failed',
                detail: detail || "Your entry didn't pass the vibe check."
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
                    <Sparkles className="text-primary-500 w-6 h-6" />
                    New Entry
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Reflect on your day. AI will help you stay authentic.
                </p>
            </div>

            <Card className={cn("transition-all duration-300", aiFeedback?.type === 'error' && "border-red-500 ring-2 ring-red-100 dark:ring-red-900")}>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Textarea
                                {...register("content", { required: "Content is required", minLength: { value: 10, message: "Min 10 words" } })}
                                placeholder="Today I learned..."
                                className="min-h-[200px] text-lg resize-none p-4 leading-relaxed"
                            />
                            {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                        </div>

                        {aiFeedback && (
                            <div className={cn(
                                "p-4 rounded-md flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2",
                                aiFeedback.type === 'error' ? "bg-red-50 text-red-900 border border-red-200 dark:bg-red-900/20 dark:text-red-200" : "bg-green-50 text-green-900"
                            )}>
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">{aiFeedback.message}</p>
                                    <p className="opacity-90">{aiFeedback.detail}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isAnalyzing} size="lg" className="w-full sm:w-auto">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing Authenticity...
                                    </>
                                ) : (
                                    'Submit Entry'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-gray-400">
                <p>AI checks for generic content, repetition, and depth.</p>
            </div>
        </div>
    );
}
