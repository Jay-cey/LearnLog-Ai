'use client';

import { StreakCounter } from "@/components/streak-counter";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { AchievementsList } from "@/components/gamification/achievements-list";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import { PenTool, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

// Stats Component for Bento Grid
function MiniStat({ label, value, icon: Icon, colorClass, delay = 0 }: { label: string; value: string; icon: any; colorClass: string; delay?: number }) {
    return (
        <GlassCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col justify-between p-6 min-h-[160px]"
            gradient={colorClass}
        >
            <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-inner", colorClass)}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
            </div>
            <div className="mt-4">
                <h4 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</h4>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</p>
            </div>
        </GlassCard>
    );
}

export default function DashboardPage() {
    const { userId, user } = useCurrentUser();
    const { stats, activity, isLoading } = useAnalytics(userId);

    // Format numbers with commas
    const totalWords = stats?.total_words?.toLocaleString() || "0";
    const totalEntries = stats?.total_entries?.toString() || "0";
    const currentLevel = stats?.level?.toString() || "1";

    return (
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">{user?.name || "Traveler"}</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-2xl"
                >
                    Your garden of knowledge is growing. What will you plant today?
                </motion.p>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/* Hero: Streak Counter (Large Square) */}
                <GlassCard
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-1 md:row-span-2 relative overflow-hidden bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900/40 border-orange-100 dark:border-orange-500/10"
                >
                    <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <StreakCounter />
                </GlassCard>

                {/* Stats: Total Words */}
                <MiniStat
                    label="Words Written"
                    value={isLoading ? "..." : totalWords}
                    icon={PenTool}
                    colorClass="from-primary-400 to-emerald-600"
                    delay={0.1}
                />

                {/* Stats: Total Entries */}
                <MiniStat
                    label="Total Entries"
                    value={isLoading ? "..." : totalEntries}
                    icon={Layers}
                    colorClass="from-blue-400 to-indigo-600"
                    delay={0.2}
                />

                {/* Stats: Current Level */}
                <MiniStat
                    label="Current Level"
                    value={isLoading ? "..." : currentLevel}
                    icon={Zap}
                    colorClass="from-amber-400 to-orange-500"
                    delay={0.3}
                />

                {/* Main: Activity Chart (Wide Rectangle) */}
                <GlassCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 lg:col-span-3 min-h-[320px] p-8"
                >
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Activity</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your daily contribution flow</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm px-3 py-2 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-[200px] w-full flex items-center justify-center text-gray-400">
                        <ActivityChart data={activity} />
                    </div>
                </GlassCard>

                {/* Footer: Achievements (Full Width) */}
                <GlassCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 md:col-span-3 lg:col-span-4 p-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/20 text-white">
                            <span className="text-xl font-bold">🏆</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Achievements</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Milestones on your journey</p>
                        </div>
                    </div>
                    <AchievementsList />
                </GlassCard>
            </div>
        </div>
    );
}
