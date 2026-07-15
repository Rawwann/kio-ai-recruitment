import { useState, useEffect, useCallback } from 'react';
import {
    getGitHubStatus,
    connectGitHub,
    disconnectGitHub,
    redirectToGitHubAuth,
} from '@/lib/api/candidateService';
import type { GitHubStatus } from '@/types/candidate';

export function useGitHubConnection() {
    const [status, setStatus] = useState<GitHubStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGitHubStatus();
            setStatus(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch GitHub status';
            setError(errorMessage);
            console.error('GitHub status error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const connect = useCallback(async (code: string) => {
        try {
            setError(null);
            const response = await connectGitHub({ code });
            if (response.success) {
                setStatus({
                    connected: true,
                    username: response.username,
                    avatarUrl: response.avatarUrl,
                });
                return response;
            }
            throw new Error(response.message || 'Failed to connect GitHub');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect GitHub';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const disconnect = useCallback(async () => {
        try {
            setError(null);
            await disconnectGitHub();
            setStatus({ connected: false });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect GitHub';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const initiateConnection = useCallback((returnToPath?: string) => {
        try {
            redirectToGitHubAuth(returnToPath ?? '/candidate/dashboard');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initiate GitHub connection';
            setError(errorMessage);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return {
        status,
        loading,
        error,
        fetchStatus,
        connect,
        disconnect,
        initiateConnection,
        isConnected: status?.connected ?? false,
    };
}
