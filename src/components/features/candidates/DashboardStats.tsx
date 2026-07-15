'use client';

import { Activity, Send, TrendingUp, Github, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Badge } from '@/components/ui/data-display/badge';
import { Button } from '@/components/ui/forms/button';
import type { CandidateStats, GitHubStatus } from '@/types/candidate';

interface DashboardStatsProps {
    stats: CandidateStats;
    githubStatus: GitHubStatus | null;
    onConnectGitHub: () => void;
}

export function DashboardStats({ stats, githubStatus, onConnectGitHub }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Simulations Card */}
            <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Active
                        </Badge>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeSimulations}</p>
                        <p className="text-sm text-gray-600">Active Simulations</p>
                    </div>
                </CardContent>
            </Card>

            {/* Applications Sent Card */}
            <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Send className="h-6 w-6 text-purple-600" />
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Total
                        </Badge>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.applicationsSent}</p>
                        <p className="text-sm text-gray-600">Applications Sent</p>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Strength Card */}
            <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <Badge
                            variant="secondary"
                            className={
                                stats.profileStrength >= 80
                                    ? 'bg-green-100 text-green-700'
                                    : stats.profileStrength >= 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }
                        >
                            {stats.profileStrength >= 80 ? 'Strong' : stats.profileStrength >= 50 ? 'Medium' : 'Weak'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.profileStrength}%</p>
                        <p className="text-sm text-gray-600">Profile Strength</p>
                    </div>
                </CardContent>
            </Card>

            {/* GitHub Status Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-800 via-violet-600 to-[#d97706] text-white transition-all duration-300 hover:scale-105">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                            <Github className="h-6 w-6 text-white" />
                        </div>
                        {githubStatus?.connected ? (
                            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                                <Check className="h-3 w-3 mr-1" />
                                Connected
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-white/30 text-white">
                                Not Connected
                            </Badge>
                        )}
                    </div>
                    {githubStatus?.connected ? (
                        <div>
                            <p className="text-2xl font-bold text-white mb-1">GitHub</p>
                            <p className="text-sm text-white/80 mb-2">@{githubStatus.username}</p>
                            <Button
                                size="sm"
                                className="bg-[#00D26A] text-white hover:bg-[#00b55b] w-full gap-2 border-0"
                                onClick={() => window.open(`https://github.com/${githubStatus.username}`, '_blank')}
                            >
                                View Profile
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-2xl font-bold text-white mb-2">GitHub</p>
                            <Button
                                onClick={onConnectGitHub}
                                size="sm"
                                className="bg-white text-purple-700 hover:bg-gray-100 w-full font-semibold border-0"
                            >
                                Connect
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}