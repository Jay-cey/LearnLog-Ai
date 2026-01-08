'use client';

import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/ui/neural-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";

export function LandingHero() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-white dark:bg-gray-950">
            <NeuralBackground color="#059669" density={60} />

            {/* Navigation (Transparent) */}
            <header className="px-6 lg:px-8 h-16 flex items-center z-10 w-full max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-bold text-xl flex items-center gap-2"
                >
                    <div className="bg-primary-500/10 p-1.5 rounded-lg backdrop-blur-sm">
                        <BrainCircuit className="w-6 h-6 text-primary-500" />
                    </div>
                    LearnLog AI
                </motion.div>

                <div className="ml-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Button asChild variant="ghost" className="font-medium">
                            <Link href="/signin">Sign In</Link>
                        </Button>
                    </motion.div>
                </div>
            </header>

            {/* Main Hero Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10 relative">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <div className="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 dark:border-primary-800/30 dark:bg-primary-950/30 dark:text-primary-400">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 fill-primary-600 dark:fill-primary-400" />
                        <span>v1.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Turn Your Learning into <br />
                        <span className="text-primary-600 dark:text-primary-500">Tangible Growth</span>
                    </h1>

                    <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-xl/relaxed dark:text-gray-300 mb-10 leading-8">
                        The intelligent journal that validates your daily progress.
                        Move beyond simple checkboxes with AI-powered insights,
                        streak tracking, and semantic analysis.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary-500/20">
                            <Link href="/signin">
                                Get Started Free
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
                            <Link href="https://github.com/yourusername/learnlog-ai">View on GitHub</Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Floating Abstract Visual (Optional decorative element) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-400/20 blur-[120px] rounded-full -z-10 dark:bg-primary-600/10 pointer-events-none" />
            </main>

            {/* Footer / Tech Stack */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="py-10 text-center text-sm text-gray-400 z-10"
            >
                <p>Built with Next.js 15, FastAPI, and pgvector.</p>
            </motion.footer>
        </div>
    );
}
