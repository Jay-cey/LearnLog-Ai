'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>
                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    >
                        Sign in with Google
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    >
                        <Github className="mr-2 h-4 w-4" />
                        Sign in with GitHub
                    </Button>
                </div>
            </div>
        </div>
    );
}
