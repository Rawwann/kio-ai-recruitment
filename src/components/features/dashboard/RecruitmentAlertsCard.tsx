"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { cn } from "@/lib/utils";
import { HeaderActions } from "./HeaderActions";
import type { AlertPriority, RecruitmentAlert } from "@/lib/constants/dashboard/live-feed-data";

const PRIORITY_ORDER: Record<AlertPriority, number> = { high: 0, medium: 1, low: 2 };
const SORT_OPTIONS = ["Latest", "Priority"] as const;

export function RecruitmentAlertsCard({
    alertsSort,
    setAlertsSort,
    items,
}: {
    alertsSort: string;
    setAlertsSort: (v: string) => void;
    items: RecruitmentAlert[];
}) {
    const sortedAlerts = useMemo(() => {
        const copy = [...items];
        if (alertsSort === "Priority") {
            copy.sort(
                (a, b) =>
                    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || b.timestamp - a.timestamp,
            );
        } else {
            copy.sort((a, b) => b.timestamp - a.timestamp);
        }
        return copy;
    }, [alertsSort, items]);

    if (!items.length) {
        return (
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Recruitment Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 p-2">No notifications yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Recruitment Alerts
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Sort by:</span>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                        {SORT_OPTIONS.map((opt) => {
                            const isActive = alertsSort === opt;
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setAlertsSort(opt)}
                                    className={cn(
                                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                                        isActive
                                            ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm font-semibold"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                                    )}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 py-2 flex flex-col justify-between">
                {sortedAlerts.map((alert, idx) => (
                    <div
                        key={`${alert.timestamp}-${idx}`}
                        className="flex items-start justify-between p-3 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                        <div className="flex gap-3 min-w-0">
                            <span className="text-lg shrink-0">{alert.icon}</span>
                            <div>
                                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">
                                    {alert.title}
                                </h4>
                                <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{alert.desc}</p>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 pl-2">{alert.time}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
