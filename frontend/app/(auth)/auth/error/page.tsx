'use client';

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-500">Authentication Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {error || "An unknown error occurred during sign in."}
                    </p>
                    <Button asChild variant="destructive" className="w-full">
                        <Link href="/signin">Try Again</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
