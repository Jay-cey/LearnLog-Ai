import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    gradient?: string;
}

export function GlassCard({ children, className, gradient, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "group relative overflow-hidden rounded-3xl border transition-all duration-300",
                "bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl", // Base Glass (Light: White-ish, Dark: Dark-ish)
                "border-gray-100 dark:border-white/5", // Borders
                "shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-primary-900/10", // Shadows
                className
            )}
            {...props}
        >
            {gradient && (
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br", gradient)} />
            )}
            <motion.div className="relative z-10 h-full">
                {children}
            </motion.div>
        </motion.div>
    );
}
