import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import * as React from "react";

// ──────────────────────────────────────────────────────────────────
// MiniChart
// Reusable mini bar chart used in the KPI stat cards.
// Receives a fill color (supports CSS vars) and optional data.
// ──────────────────────────────────────────────────────────────────
export function MiniChart({
    fill = "var(--chart-1)",
    data,
}: {
    fill?: string;
    data?: { value: number }[];
}) {
    const fallback = React.useMemo(
        () => [{ value: 20 }, { value: 40 }, { value: 30 }, { value: 70 }, { value: 50 }, { value: 90 }],
        [],
    );
    const chartData = data && data.length > 0 ? data : fallback;

    return (
        <div className="h-8 w-16">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}