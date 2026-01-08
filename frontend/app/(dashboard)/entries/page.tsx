'use client';

import { useEntries } from "@/hooks/useEntries";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EntriesPage() {
    const [search, setSearch] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);

    // TODO: Debounce search in real implementation
    // Passing filters to useEntries hook (need to update useEntries to accept params)
    // For now assuming the hook will be updated or we filter client side for quick prototype if API ready
    const { entries, isLoading } = useEntries("user-id-placeholder");

    const filteredEntries = entries?.filter(entry => {
        const matchesSearch = entry.content.toLowerCase().includes(search.toLowerCase());
        const matchesDate = date ? entry.date === date.toISOString().split('T')[0] : true;
        return matchesSearch && matchesDate;
    });

    if (isLoading) return <div className="p-8 text-center">Loading entries...</div>;

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Journal</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and filter your learning history.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search entries..."
                            className="pl-9 w-full sm:w-[250px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Filter by date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {(search || date) && (
                        <Button variant="ghost" onClick={() => { setSearch(""); setDate(undefined); }}>
                            <X className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {filteredEntries?.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-gray-500">No entries found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredEntries?.map((entry) => (
                        <Card key={entry.id} className="hover:shadow-md transition-all hover:border-primary-200 group flex flex-col h-full">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex justify-between items-center text-primary-700">
                                    {formatDate(entry.date)}
                                    {entry.ai_score && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Valid</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="line-clamp-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {entry.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
