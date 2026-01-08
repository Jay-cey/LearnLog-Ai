'use client';

import { motion } from "framer-motion";
import { Lock, Footprints, Flame, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data until API is connected
const achievements = [
    { id: 1, name: "First Steps", description: "Created your first entry.", icon: Footprints, unlocked: false },
    { id: 2, name: "On Fire", description: "Reached a 3-day streak.", icon: Flame, unlocked: false },
    { id: 3, name: "Unstoppable", description: "Reached a 7-day streak.", icon: Zap, unlocked: false },
    { id: 4, name: "Insightful", description: "Wrote over 5000 words.", icon: Trophy, unlocked: false },
];

export function AchievementsList() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, i) => (
                <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                        "relative p-4 rounded-xl border flex items-center gap-4 overflow-hidden group transition-all duration-300",
                        achievement.unlocked
                            ? "bg-white/40 dark:bg-gray-800/40 border-white/50 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-md"
                            : "bg-gray-100/30 dark:bg-gray-900/30 border-gray-200/50 dark:border-gray-800/50 opacity-60 grayscale-[0.8]"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        achievement.unlocked
                            ? "bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                    )}>
                        {achievement.unlocked ? <achievement.icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                        <h4 className={cn("font-bold text-sm", achievement.unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-500")}>
                            {achievement.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {achievement.description}
                        </p>
                    </div>

                    {/* Shine effect for unlocked */}
                    {achievement.unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
