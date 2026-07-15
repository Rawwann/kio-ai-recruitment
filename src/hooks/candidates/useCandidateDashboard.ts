// hooks/candidates/useCandidateDashboard.ts
import { useEffect, useState, useCallback } from 'react';
import type {
    CandidateStats,
    ActiveSimulation,
    ApplicationHistoryItem,
    GitHubStatus,
} from '@/types/candidate';
import {
    getCandidateStats,
    getActiveSimulations,
    getApplicationHistory,
    getGitHubStatus,
} from '@/lib/api/candidateService';

export function useCandidateDashboard() {
    const [stats, setStats] = useState<CandidateStats | null>(null);
    const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
    const [simulations, setSimulations] = useState<ActiveSimulation[] | null>(null);
    const [history, setHistory] = useState<ApplicationHistoryItem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const emptyStats = (): CandidateStats => ({
            activeSimulations: 0,
            applicationsSent: 0,
            profileStrength: 0,
            github_connected: false,
        });

        const [statsResult, githubResult, simResult, historyResult] = await Promise.allSettled([
            getCandidateStats(),
            getGitHubStatus(),
            getActiveSimulations(),
            getApplicationHistory(),
        ]);

        const statsData: CandidateStats | null =
            statsResult.status === 'fulfilled' ? statsResult.value : null;
        const githubData: GitHubStatus =
            githubResult.status === 'fulfilled' ? githubResult.value : { connected: false };

        const baseStats = statsData ?? emptyStats();
        // BUG-4.8: Use raw backend value — no frontend cap.
        // The profile sidebar reads the same backend function, so they must match.
        const updatedStats: CandidateStats = {
            ...baseStats,
            github_connected: githubData.connected,
        };

        setStats(updatedStats);
        setGithubStatus(githubData);
        setSimulations(simResult.status === 'fulfilled' ? simResult.value : []);
        setHistory(historyResult.status === 'fulfilled' ? historyResult.value : []);

        const allFailed =
            statsResult.status === 'rejected' &&
            simResult.status === 'rejected' &&
            historyResult.status === 'rejected';
        if (allFailed) {
            const first = statsResult.status === 'rejected' ? statsResult.reason : simResult.reason;
            setError(
                first instanceof Error
                    ? first
                    : new Error('Failed to fetch dashboard data'),
            );
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats,
        githubStatus,
        simulations,
        history,
        isLoading,
        error,
        refetch: fetchData,
        refreshData: fetchData,
        isGitHubConnected: githubStatus?.connected ?? false,
    };
}