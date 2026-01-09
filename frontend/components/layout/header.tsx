'use client';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Bell, Search, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
    const { user } = useCurrentUser();

    const handleSignOut = () => {
        signOut({ callbackUrl: '/signin' });
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 shadow-sm transition-all duration-300">
            <div className="flex-1 max-w-md">
                {/* Search Bar (Visual Only for now) */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <Input
                        placeholder="Search entries..."
                        className="pl-10 bg-transparent border-gray-200 dark:border-gray-800 focus:bg-white dark:focus:bg-slate-900 transition-all rounded-xl"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <Bell className="h-5 w-5" />
                </Button>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2" />

                {/* User Profile Dropdown */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-10 w-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            )}
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0 mr-4" align="end">
                        <div className="flex flex-col">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {user?.email || ''}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm px-3 py-2 h-auto font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
                                    disabled
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                    <span className="ml-auto text-xs text-gray-400">(Soon)</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm px-3 py-2 h-auto font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
