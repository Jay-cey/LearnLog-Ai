'use client';

import { useStreak } from "@/hooks/useStreak";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakCounter() {
    const { userId } = useCurrentUser();
    const { streak, isLoading } = useStreak(userId || "");

    if (isLoading) return null;

    const count = streak?.current_streak || 0;

    return (
        <div className="flex flex-col items-center justify-center p-6 h-full text-center relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-orange-500/10 blur-[60px] rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />

            <div className={cn(
                "relative z-10 flex items-center justify-center w-32 h-32 mb-4 transition-transform duration-500 group-hover:scale-110"
            )}>
                {/* Flame Container */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent blur-xl rounded-full animate-pulse" />
                <Flame
                    className={cn(
                        "w-20 h-20 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]",
                        count > 0 ? "text-orange-500 fill-orange-500 animate-bounce-slow" : "text-gray-300 dark:text-gray-700"
                    )}
                />
            </div>

            <div className="relative z-10">
                <h3 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-orange-500 to-amber-300 drop-shadow-sm">
                    {count} {count === 1 ? 'Day' : 'Days'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-wider">
                    Current Streak
                </p>
            </div>

            {count > 0 && (
                <div className="mt-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-orange-800/50">
                    Keep the fire burning! 🔥
                </div>
            )}
        </div>
    );
}
