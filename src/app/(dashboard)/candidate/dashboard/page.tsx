'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, LayoutDashboard, Search } from 'lucide-react';
import { useCandidateDashboard } from '@/hooks/candidates/useCandidateDashboard';
import {
    connectGitHub,
    redirectToGitHubAuth,
    safeDecodeGitHubOAuthReturnPath,
} from '@/lib/api/candidateService';
import { DashboardStats } from '@/components/features/candidates/DashboardStats';
import { GitHubWarningBanner } from '@/components/features/candidates/GitHubWarningBanner';
import { MagicSearchBar } from '@/components/features/company/CompanySearchBar';
import { ActiveSimulations } from '@/components/features/candidates/ActiveSimulations';
import { ApplicationHistory } from '@/components/features/candidates/ApplicationHistory';
import { Skeleton } from '@/components/ui/feedback/skeleton';
import { Card, CardContent } from '@/components/ui/layout/card';
import { PageShell } from '@/components/shared/PageShell';
import { Button } from '@/components/ui/forms/button';
import { motion } from 'motion/react';
import { NotificationBell } from '@/components/features/dashboard/NotificationBell';
import { Input } from '@/components/ui/forms/input';

// Inner component that uses useSearchParams (must be inside Suspense)
function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        stats,
        githubStatus,
        simulations,
        history,
        isLoading,
        error,
        refetch,
        refreshData,
        isGitHubConnected,
    } = useCandidateDashboard();

    const [connectingGitHub, setConnectingGitHub] = useState(false);

    // Handle GitHub OAuth callback
    useEffect(() => {
        const handleGitHubCallback = async () => {
            const code = searchParams.get('code');
            const oauthError = searchParams.get('error');

            if (oauthError) {
                toast.error(`GitHub authorization failed: ${oauthError}`);
                router.replace('/candidate/dashboard');
                return;
            }

            if (code) {
                setConnectingGitHub(true);
                const next = safeDecodeGitHubOAuthReturnPath(searchParams.get('state'));
                try {
                    const response = await connectGitHub({ code });
                    if (response.success) {
                        toast.success(response.message || 'GitHub connected successfully!');
                        await refreshData();
                    }
                } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Failed to connect GitHub account');
                } finally {
                    setConnectingGitHub(false);
                    router.replace(next);
                }
            }
        };

        handleGitHubCallback();
    }, [searchParams, router, refreshData]);

    const handleConnectGitHub = () => {
        try {
            // Canonical redirect_uri (NEXT_PUBLIC_GITHUB_REDIRECT_URI or .../candidate/dashboard) + state
            redirectToGitHubAuth('/candidate/dashboard');
        } catch {
            toast.error('Failed to initiate GitHub connection');
        }
    };

    if (connectingGitHub) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Connecting your GitHub account...</p>
                </div>
            </div>
        );
    }

    if (isLoading && !stats) {
        return (
            <PageShell className="py-6 space-y-6" padding="none">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </PageShell>
        );
    }

    if (error) {
        return (
            <PageShell className="py-6" padding="none">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-red-500 mb-4">Failed to load dashboard: {error.message}</p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </CardContent>
                </Card>
            </PageShell>
        );
    }

    return (
        <PageShell className="py-6 space-y-8" padding="none">
            <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="bg-accent p-2 rounded-lg text-primary">
                            <LayoutDashboard size={20} />
                        </div>
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your activity</p>
                </div>
                <div className="flex w-full items-center gap-3 md:w-auto md:gap-4">
                    <div className="relative min-w-0 flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-9 h-10 w-full bg-white shadow-sm rounded-xl border-gray-100 focus-visible:ring-purple-500 md:w-64"
                        />
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-xl transition-colors shrink-0"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <NotificationBell
                            iconClassName="size-5 text-gray-600 hover:text-purple-600"
                        />
                    </motion.div>
                </div>
            </div>

            {stats && (
                <DashboardStats
                    stats={stats}
                    githubStatus={githubStatus}
                    onConnectGitHub={handleConnectGitHub}
                />
            )}

            {!isGitHubConnected && (
                <GitHubWarningBanner onConnect={handleConnectGitHub} />
            )}

            <ActiveSimulations simulations={simulations ?? []} />
            <ApplicationHistory applications={history ?? []} />
        </PageShell>
    );
}

export default function CandidateDashboardPage() {
    return (
        <Suspense fallback={
            <PageShell className="py-6 space-y-6" padding="none">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </PageShell>
        }>
            <DashboardContent />
        </Suspense>
    );
}
