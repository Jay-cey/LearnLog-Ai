'use client';

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from 'next/link';

export function Header() {
    //   const { data: session } = useSession();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-gray-50/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
            <div className="w-full flex-1">
                {/* Breadcrumbs or Title could go here */}
            </div>
            <div className="flex items-center gap-4">
                {/* User Menu Placeholder */}
                <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </div>
        </header>
    );
}
