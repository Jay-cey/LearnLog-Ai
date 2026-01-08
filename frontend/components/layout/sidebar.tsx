'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Home, BarChart2, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Entries', href: '/entries', icon: BookOpen },
    //   { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        LearnLog AI
                    </span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-600",
                                    isActive
                                        ? "bg-primary-100/50 text-primary-700 dark:bg-primary-800/20 dark:text-primary-400"
                                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                    <div className="mt-auto px-3 py-4 border-t dark:border-gray-800 flex items-center justify-between gap-2">
                        <Button asChild className="flex-1 justify-start gap-2 shadow-sm" size="sm">
                            <Link href="/entries/new">
                                <PlusCircle className="h-4 w-4" />
                                <span className="truncate">New Entry</span>
                            </Link>
                        </Button>
                        <ThemeToggle />
                    </div>
                </nav>
            </div>
        </div>
    );
}
