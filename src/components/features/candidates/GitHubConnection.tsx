'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/forms/button';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/data-display/avatar';
import { Badge } from '@/components/ui/data-display/badge';
import {
    getGitHubStatus,
    connectGitHub,
    disconnectGitHub,
    redirectToGitHubAuth,
    safeDecodeGitHubOAuthReturnPath,
} from '@/lib/api/candidateService';
import type { GitHubStatus } from '@/types/candidate';

interface GitHubConnectionProps {
    onConnectionChange?: (connected: boolean) => void;
}

export function GitHubConnection({ onConnectionChange }: GitHubConnectionProps) {
    const router = useRouter();
    const [status, setStatus] = useState<GitHubStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await getGitHubStatus();
            setStatus(data);
            onConnectionChange?.(data.connected);
        } catch (error) {
            console.error('Failed to fetch GitHub connection status:', error);
            // Safe default: treat as not connected (BFF/404/misconfig) so the card never stalls
            setStatus({ connected: false });
            onConnectionChange?.(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle OAuth callback via URL params
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const oauthError = urlParams.get('error');

            if (oauthError) {
                toast.error(`GitHub authorization failed: ${oauthError}`);
                window.history.replaceState({}, '', window.location.pathname);
                return;
            }

            if (code) {
                setConnecting(true);
                const next = safeDecodeGitHubOAuthReturnPath(urlParams.get('state'));
                try {
                    const response = await connectGitHub({ code });
                    if (response.success) {
                        toast.success(response.message || 'GitHub connected successfully!');
                        setStatus({
                            connected: true,
                            username: response.username,
                            avatarUrl: response.avatarUrl,
                        });
                        onConnectionChange?.(true);
                    }
                } catch (error) {
                    console.error('GitHub connection error:', error);
                    toast.error(error instanceof Error ? error.message : 'Failed to connect GitHub account');
                } finally {
                    setConnecting(false);
                    router.replace(next);
                }
            }
        };

        handleOAuthCallback();
    }, [onConnectionChange, router]);

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleConnect = () => {
        try {
            redirectToGitHubAuth('/candidate/profile');
        } catch (error) {
            console.error('GitHub redirect error:', error);
            toast.error('Failed to initiate GitHub connection');
        }
    };

    const handleDisconnect = async () => {
        if (!window.confirm('Are you sure you want to disconnect your GitHub account?')) return;
        try {
            setDisconnecting(true);
            await disconnectGitHub();
            toast.success('GitHub account disconnected');
            setStatus({ connected: false });
            onConnectionChange?.(false);
        } catch (error) {
            console.error('GitHub disconnect error:', error);
            toast.error('Failed to disconnect GitHub account');
        } finally {
            setDisconnecting(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (connecting) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <p className="text-sm text-muted-foreground">Connecting your GitHub account...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <Github className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">GitHub Integration</h3>
                            <p className="text-sm text-muted-foreground">
                                Connect your GitHub account to showcase your coding activity and repositories
                            </p>
                        </div>
                    </div>

                    {status?.connected ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-green-500">
                                        <AvatarImage src={status.avatarUrl} alt={status.username} />
                                        <AvatarFallback className="bg-gray-900 text-white">
                                            <Github className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium">Connected as @{status.username}</p>
                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                <Check className="h-3 w-3 mr-1" />
                                                Connected
                                            </Badge>
                                        </div>
                                        <a
                                            href={`https://github.com/${status.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                        >
                                            View GitHub Profile
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                {disconnecting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Disconnecting...
                                    </>
                                ) : (
                                    <>
                                        <X className="mr-2 h-4 w-4" />
                                        Disconnect GitHub
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-3">
                                    By connecting your GitHub account, you'll be able to:
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {[
                                        'Automatically import your coding projects',
                                        'Showcase your contribution activity',
                                        'Highlight your most popular repositories',
                                        'Increase profile visibility to recruiters',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button onClick={handleConnect} className="w-full kio-btn-ai-primary">
                                <Github className="mr-2 h-4 w-4" />
                                Connect GitHub Account
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">Privacy &amp; Permissions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                            'We only request read-only access to your public profile',
                            'Your GitHub credentials are never stored on our servers',
                            'You can disconnect your account at any time',
                            "We follow GitHub's security best practices",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
