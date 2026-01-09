'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    const chartData = data.length > 0 ? data : emptyData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.2, radius: 8 }}
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        backgroundColor: 'var(--card)',
                        color: 'var(--foreground)'
                    }}
                />
                {/* Use a mask or distinct colors */}
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                    </linearGradient>
                </defs>
                <Bar dataKey="words" radius={[6, 6, 6, 6]} barSize={40}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
