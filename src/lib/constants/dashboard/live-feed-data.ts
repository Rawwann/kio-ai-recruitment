// Types for live dashboard widgets (data comes from GET /api/company-stats/).

export interface TopPerformer {
    name: string;
    role: string;
    score: string;
    time: string;
    position: number;
}

export type AlertPriority = "high" | "medium" | "low";

export interface RecruitmentAlert {
    title: string;
    desc: string;
    time: string;
    icon: string;
    bgColor: string;
    priority: AlertPriority;
    timestamp: number;
}

export interface FunnelStage {
    stage: string;
    count: number;
}

/** Only used when the API returns no funnel row yet (all zeros, no fake business numbers). */
export const funnelDataByPeriod: Record<string, FunnelStage[]> = {
    Week: [
        { stage: "Applied", count: 0 },
        { stage: "Screened", count: 0 },
        { stage: "Simulation", count: 0 },
        { stage: "Hired", count: 0 },
    ],
    Month: [
        { stage: "Applied", count: 0 },
        { stage: "Screened", count: 0 },
        { stage: "Simulation", count: 0 },
        { stage: "Hired", count: 0 },
    ],
    Year: [
        { stage: "Applied", count: 0 },
        { stage: "Screened", count: 0 },
        { stage: "Simulation", count: 0 },
        { stage: "Hired", count: 0 },
    ],
};

export const funnelData: FunnelStage[] = funnelDataByPeriod["Month"];
