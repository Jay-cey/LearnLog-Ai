'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Home, BarChart2, Settings, PlusCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Entries', href: '/entries', icon: BookOpen },
    // { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    // { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className, ...props }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn("hidden lg:flex flex-col h-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-3xl transition-all duration-300", className)} {...props}>

            {/* Logo Section */}
            <div className="h-20 flex items-center px-8 border-b border-gray-200/50 dark:border-gray-800/50">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                            LearnLog
                        </span>
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                            AI Edition
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <nav className="space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group z-10",
                                    isActive
                                        ? "text-white shadow-md shadow-primary-500/20"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-tab"
                                        className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-500 rounded-xl -z-10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 mt-auto space-y-8 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-white/5 rounded-b-3xl">
                <Link href="/entries/new">
                    <Button asChild className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg shadow-primary-500/25 border-0" size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Entry
                    </Button>
                </Link>

                <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Appearance</span>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
