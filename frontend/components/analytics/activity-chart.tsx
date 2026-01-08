'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const emptyData = [
    { date: 'Mon', words: 0 },
    { date: 'Tue', words: 0 },
    { date: 'Wed', words: 0 },
    { date: 'Thu', words: 0 },
    { date: 'Fri', words: 0 },
    { date: 'Sat', words: 0 },
    { date: 'Sun', words: 0 },
];

interface ActivityChartProps {
    data?: { date: string; words: number }[];
}

export function ActivityChart({ data = [] }: ActivityChartProps) {
    // Use empty data structure if no data provided, so chart still renders axes
    const chartData = data.length > 0 ? data : emptyData;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Flow</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Words written over the last 7 days</p>
            </div>
            <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(5, 150, 105, 0.1)', radius: 4 }}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#1f2937'
                            }}
                        />
                        <Bar dataKey="words" radius={[6, 6, 6, 6]} barSize={32}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#059669" stopOpacity={1} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
