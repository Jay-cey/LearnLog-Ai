'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils'; // Assuming you have a utils file

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Midnight Growth' : 'Dawn of Growth'}`}
            className={cn("rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", className)}
        >
            {theme === 'light' ? (
                <Sun className="h-4 w-4 text-orange-500 transition-all rotate-0 scale-100" />
            ) : (
                <Moon className="h-4 w-4 text-blue-400 transition-all rotate-0 scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
