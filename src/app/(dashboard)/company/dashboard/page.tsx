"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TopHeader } from "@/components/features/dashboard/TopHeader";
import { KPIStats } from "@/components/features/dashboard/KPIStats";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { useDashboardPage } from "@/hooks/dashboard/useDashboardPage";
import { PageShell } from "@/components/shared/PageShell";
import type { TopPerformer, RecruitmentAlert, AlertPriority } from "@/lib/constants/dashboard/live-feed-data";

function ChartsLoadingFallback() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-[320px] w-full rounded-2xl" />
            <Skeleton className="h-[320px] w-full rounded-2xl" />
        </div>
    );
}

const ChartsSection = dynamic(
    () => import("@/components/features/dashboard/ChartsSection").then((m) => m.ChartsSection),
    { loading: () => <ChartsLoadingFallback /> },
);

const LiveFeed = dynamic(
    () => import("@/components/features/dashboard/LiveFeed").then((m) => m.LiveFeed),
    { loading: () => <Skeleton className="h-72 w-full rounded-2xl" /> },
);

const RightPanel = dynamic(
    () => import("@/components/features/dashboard/RightPanel").then((m) => m.RightPanel),
    { loading: () => <Skeleton className="h-[420px] w-full rounded-2xl" /> },
);

function mapPerformers(rows: CompanyStatsTopPerformer[]): TopPerformer[] {
    return rows.map((r) => ({
        position: r.position,
        name: r.name,
        role: r.role,
        score: r.score,
        time: r.time,
    }));
}

function mapAlerts(rows: CompanyStatsAlert[]): RecruitmentAlert[] {
    return rows.map((a) => ({
        title: a.title,
        desc: a.desc,
        time: a.time,
        icon: a.icon,
        bgColor: a.bgColor,
        priority: (["high", "medium", "low"].includes(a.priority) ? a.priority : "medium") as AlertPriority,
        timestamp: a.timestamp,
    }));
}

type CompanyStatsTopPerformer = {
    position: number;
    name: string;
    role: string;
    score: string;
    time: string;
};

type CompanyStatsAlert = {
    title: string;
    desc: string;
    time: string;
    icon: string;
    bgColor: string;
    priority: string;
    timestamp: number;
};

export default function CompanyDashboardPage() {
    const {
        stats,
        loading,
        error,
        tracksMonth,
        setTracksMonth,
        appsRange,
        setAppsRange,
        funnelPeriod,
        setFunnelPeriod,
        alertsSort,
        setAlertsSort,
    } = useDashboardPage();

    const topPerformers = stats ? mapPerformers(stats.top_performers as CompanyStatsTopPerformer[]) : [];
    const alerts = stats ? mapAlerts(stats.alerts as CompanyStatsAlert[]) : [];

    return (
        <div className="flex flex-col min-h-screen bg-transparent dark:bg-slate-950/50">
            <PageShell width="wide" className="flex-1 py-4 md:py-8" padding="none">
                <TopHeader />

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                        Could not load dashboard: {error}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mt-4">
                    <div className="flex flex-col space-y-6">
                        <KPIStats
                            loading={loading}
                            activeCampaigns={stats?.active_campaigns ?? 0}
                            totalApplicants={stats?.total_applicants ?? 0}
                            simulationsPassed={stats?.simulations_passed ?? 0}
                            needsReview={stats?.needs_review ?? 0}
                        />

                        <ChartsSection
                            tracksMonth={tracksMonth}
                            setTracksMonth={setTracksMonth}
                            appsRange={appsRange}
                            setAppsRange={setAppsRange}
                            tracksDistribution={stats?.tracks_distribution}
                            applicationsOverTime={stats?.applications_over_time}
                        />

                        <LiveFeed
                            funnelPeriod={funnelPeriod}
                            setFunnelPeriod={setFunnelPeriod}
                            alertsSort={alertsSort}
                            setAlertsSort={setAlertsSort}
                            funnel={stats?.funnel}
                            topPerformers={topPerformers}
                            alerts={alerts}
                        />
                    </div>

                    <div className="flex flex-col space-y-6">
                        <RightPanel />
                    </div>
                </div>
            </PageShell>
        </div>
    );
}
