'use client';

import { StreakCounter } from "@/components/streak-counter";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { AchievementsList } from "@/components/gamification/achievements-list";
import { motion } from "framer-motion";
import { PenTool, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable Glass Card Component
function GlassCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

// Stats Component for Bento Grid
function MiniStat({ label, value, icon: Icon, colorClass, delay }: { label: string; value: string; icon: any; colorClass: string; delay: number }) {
    return (
        <GlassCard delay={delay} className="flex flex-col justify-between h-full min-h-[140px]">
            <div className={cn("p-3 w-fit rounded-2xl", colorClass)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h4 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">{value}</h4>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </GlassCard>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back, <span className="text-primary-600">Traveler</span>.
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Your growth journey continues today.
                </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                {/* Hero: Streak Counter (Large Square) */}
                <GlassCard className="md:col-span-1 md:row-span-2 flex items-center justify-center bg-gradient-to-br from-orange-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50" delay={0.1}>
                    <StreakCounter />
                </GlassCard>

                {/* Stats: Total Words */}
                <MiniStat
                    label="Total Words"
                    value="0"
                    icon={PenTool}
                    colorClass="bg-blue-500"
                    delay={0.2}
                />

                {/* Stats: Total Entries */}
                <MiniStat
                    label="Entries"
                    value="0"
                    icon={Layers}
                    colorClass="bg-purple-500"
                    delay={0.3}
                />

                {/* Stats: Current Level */}
                <MiniStat
                    label="Level"
                    value="1"
                    icon={Zap}
                    colorClass="bg-emerald-500"
                    delay={0.4}
                />

                {/* Main: Activity Chart (Wide Rectangle) */}
                <GlassCard className="md:col-span-2 lg:col-span-3 min-h-[300px]" delay={0.5}>
                    <ActivityChart />
                </GlassCard>

                {/* Footer: Achievements (Full Width) */}
                <GlassCard className="col-span-1 md:col-span-3 lg:col-span-4" delay={0.6}>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Achievements</h3>
                    <AchievementsList />
                </GlassCard>
            </div>
        </div>
    );
}
