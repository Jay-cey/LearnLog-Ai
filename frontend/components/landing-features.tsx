'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, Calendar, Flame, Lock, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
    {
        title: "AI Analysis",
        description: "Real-time semantic validation ensures your entries are authentic and non-generic.",
        icon: Brain,
        className: "md:col-span-2",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
    },
    {
        title: "Streak Tracking",
        description: "Visualize your consistency with a dynamic flame counter.",
        icon: Flame,
        className: "md:col-span-1",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "Privacy First",
        description: "Your journal is yours. We prioritize data security and encryption.",
        icon: Lock,
        className: "md:col-span-1",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        title: "Calendar Timeline",
        description: "Review your growth over time with an intuitive calendar view.",
        icon: Calendar,
        className: "md:col-span-2",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
];

export function LandingFeatures() {
    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        More than just a journal
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        LearnLog AI combines the simplicity of Markdown with the power of Artificial Intelligence to keep you on track.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 hover:border-gray-300 transition-colors dark:bg-gray-900/50 dark:border-gray-800 dark:hover:border-gray-700",
                                feature.className
                            )}
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", feature.bg)}>
                                <feature.icon className={cn("w-6 h-6", feature.color)} />
                            </div>

                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                {feature.title}
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Subtle gradient glow/blob on hover */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-800 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
