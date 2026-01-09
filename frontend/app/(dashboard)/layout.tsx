import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0B0C15] transition-colors duration-300">
            {/* Background Gradients/Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-accent-500/10 dark:bg-accent-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="relative flex min-h-screen p-4 gap-6">
                {/* Floating Sidebar (Desktop) */}
                <div className="hidden lg:block w-72 shrink-0 relative">
                    <Sidebar className="fixed top-4 bottom-4 w-72" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Header />
                    <main className="flex-1 mt-6 animate-fade-in">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
