"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyStats, type CompanyDashboardStats } from "@/lib/api/companyService";

export function useDashboardPage() {
    const [stats, setStats] = useState<CompanyDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [tracksMonth, setTracksMonth] = useState("Month");
    const [appsRange, setAppsRange] = useState("Last 8 Months");
    const [funnelPeriod, setFunnelPeriod] = useState("Month");
    const [alertsSort, setAlertsSort] = useState("Latest");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCompanyStats();
            setStats(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load dashboard");
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        stats,
        loading,
        error,
        reload: load,
        tracksMonth,
        setTracksMonth,
        appsRange,
        setAppsRange,
        funnelPeriod,
        setFunnelPeriod,
        alertsSort,
        setAlertsSort,
    };
}
