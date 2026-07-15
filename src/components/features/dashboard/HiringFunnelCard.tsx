"use client";

import { useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { HeaderActions } from "./HeaderActions";
import { downloadChartAsPNG, exportToCSV } from "@/lib/chart-export";
import { cn } from "@/lib/utils";
import type { FunnelStage } from "@/lib/constants/dashboard/live-feed-data";
import { funnelDataByPeriod } from "@/lib/constants/dashboard/live-feed-data";

const PERIODS = ["Week", "Month", "Year"] as const;

export function HiringFunnelCard({
    funnelPeriod,
    setFunnelPeriod,
    stages,
}: {
    funnelPeriod: string;
    setFunnelPeriod: (v: string) => void;
    stages?: Record<string, FunnelStage[]>;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const currentData =
        stages?.[funnelPeriod] ??
        stages?.["Month"] ??
        funnelDataByPeriod[funnelPeriod] ??
        funnelDataByPeriod["Month"];

    const maxCount = Math.max(...currentData.map((d) => d.count), 1);
    const yAxisFormatter = (val: number) =>
        maxCount > 0 ? `${Math.round((val / maxCount) * 100)}%` : "0%";

    async function handleDownloadPng() {
        if (!cardRef.current) {
            toast.error("Chart not ready");
            return;
        }
        toast.info("Downloading…");
        try {
            await downloadChartAsPNG(cardRef.current, "hiring-funnel.png");
        } catch (err) {
            console.error("[HiringFunnel] download error:", err);
            toast.error("Download failed — check browser console");
        }
    }

    function handleExportData() {
        toast.info("Exporting…");
        exportToCSV(
            `hiring-funnel-${funnelPeriod.toLowerCase()}.csv`,
            currentData.map((d) => ({ Stage: d.stage, Count: d.count })),
        );
    }

    return (
        <div ref={cardRef}>
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        Hiring Funnel
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                            {PERIODS.map((period) => {
                                const isActive = funnelPeriod === period;
                                return (
                                    <button
                                        key={period}
                                        type="button"
                                        onClick={() => setFunnelPeriod(period)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                                            isActive
                                                ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                                        )}
                                    >
                                        {period}
                                    </button>
                                );
                            })}
                        </div>
                        <HeaderActions
                            variant="funnel"
                            onDownloadPng={handleDownloadPng}
                            onExportFunnelData={handleExportData}
                        />
                    </div>
                </CardHeader>
                <CardContent className="h-[240px] w-full px-2 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
                            <XAxis dataKey="stage" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: "#f8fafc" }}
                                contentStyle={{ borderRadius: "12px", border: "none" }}
                            />
                            <Bar dataKey="count" fill="#7e22ce" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
