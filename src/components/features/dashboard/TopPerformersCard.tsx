"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { Crown, Medal } from "lucide-react";
import { HeaderActions } from "./HeaderActions";
import { exportToCSV } from "@/lib/chart-export";
import type { TopPerformer } from "@/lib/constants/dashboard/live-feed-data";

export function TopPerformersCard({ performers }: { performers: TopPerformer[] }) {
    const router = useRouter();

    function handleViewAll() {
        toast.info("Redirecting…");
        setTimeout(() => router.push("/company/candidates"), 400);
    }

    function handleExportList() {
        toast.info("Exporting…");
        exportToCSV(
            "top-performers.csv",
            performers.map((p) => ({
                Position: p.position,
                Name: p.name,
                Role: p.role,
                Score: p.score,
                Time: p.time,
            })),
        );
    }

    if (!performers.length) {
        return (
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        Top Performers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 p-4">No evaluation data yet for your projects.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Top Performers
                </CardTitle>
                <HeaderActions variant="performers" onViewAll={handleViewAll} onExportList={handleExportList} />
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col justify-between py-2">
                {performers.map((performer, idx) => (
                    <div
                        key={`${performer.name}-${idx}`}
                        className="flex items-start justify-between p-3 py-2.5 rounded-xl transition-colors"
                    >
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                {performer.position === 1 ? (
                                    <Crown className="w-5 h-5 text-purple-600" />
                                ) : performer.position === 2 ? (
                                    <Medal className="w-5 h-5 text-purple-500" />
                                ) : (
                                    <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-purple-400">
                                        {performer.position}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-[13px] font-medium text-slate-900 dark:text-white leading-tight">
                                    {performer.name} scored <span className="font-bold">{performer.score}</span> in{" "}
                                    {performer.role}.
                                </h4>
                            </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 pl-2">
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                {performer.time.split(",")[0] ?? ""}
                            </span>
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                                {performer.time.split(",")[1] ?? ""}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
