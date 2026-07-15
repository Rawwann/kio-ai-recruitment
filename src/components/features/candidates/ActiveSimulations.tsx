'use client';

import { useState } from 'react';
import { Clock, ExternalLink, Sparkles, CheckCircle2, Loader2, Send, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Badge } from '@/components/ui/data-display/badge';
import { Button } from '@/components/ui/forms/button';
import { Input } from '@/components/ui/forms/input';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api/apiClient';
import type { ActiveSimulation } from '@/types/candidate';

interface ActiveSimulationsProps {
    simulations: ActiveSimulation[];
}

export function ActiveSimulations({ simulations }: ActiveSimulationsProps) {
    const getDeadlineColor = (index: number) => {
        // Color coding based on urgency (just for visual variety)
        if (index === 0) return 'text-red-600 bg-red-50';
        if (index === 1) return 'text-purple-600 bg-purple-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Active Simulations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {simulations.length === 0 ? (
                    <Card className="md:col-span-2 border-dashed border-slate-200 bg-slate-50/50 dark:bg-slate-900/30 dark:border-slate-700">
                        <CardContent className="flex flex-col items-center justify-center py-14 px-6 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                No active simulations
                            </p>
                            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                When you apply to a project, in-progress work will show up here. Browse
                                available projects to get started.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    simulations.map((simulation, index) => (
                        <SimulationCard
                            key={simulation.id}
                            simulation={simulation}
                            deadlineColor={getDeadlineColor(index)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function SimulationCard({ simulation, deadlineColor }: { simulation: ActiveSimulation; deadlineColor: string }) {
    const [repoUrl, setRepoUrl] = useState('');
    const [submitted, setSubmitted] = useState(!!simulation.githubRepoUrl);
    const [submitting, setSubmitting] = useState(false);
    const displayRepoUrl = submitted ? (simulation.githubRepoUrl || repoUrl) : '';

    const handleSubmitRepo = async () => {
        const trimmed = repoUrl.trim();
        if (!trimmed) {
            toast.error('Please enter a valid GitHub repository URL.');
            return;
        }
        if (!trimmed.startsWith('https://github.com/')) {
            toast.error('URL must start with https://github.com/');
            return;
        }
        setSubmitting(true);
        try {
            await apiFetch(`/api/projects/my-applications/${simulation.id}/`, {
                method: 'PATCH',
                body: { repo_url: trimmed },
            });
            setSubmitted(true);
            toast.success('Submitted. Your repository URL is locked for grading.');
        } catch {
            toast.error('Failed to submit repository URL. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
                {/* Deadline Badge */}
                <div className="mb-2">
                    <Badge
                        variant="secondary"
                        className={`${deadlineColor} font-medium`}
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        {simulation.timeRemaining ||
                            `Deadline: ${simulation.deadline ? new Date(simulation.deadline).toLocaleDateString() : 'No deadline'}`}
                    </Badge>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900">
                    {simulation.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">
                    {simulation.description}
                </p>

                {/* ── Step C: Open Company Starter Repo ── */}
                {simulation.starterTemplate && (
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={() => window.open(simulation.starterTemplate, '_blank')}
                    >
                        <Github className="h-4 w-4" />
                        Open Company Starter Repo
                        <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                    </Button>
                )}

                {/* ── Step D: Submit Your Solution Repo ── */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-sm font-medium text-gray-700">
                        Submit Your Solution Repo
                    </label>

                    {submitted ? (
                        /* ── Step E: Post-Submission Lock ── */
                        <div className="flex items-center gap-2">
                            <Input
                                value={displayRepoUrl}
                                disabled
                                readOnly
                                className="flex-1 bg-slate-50 text-sm"
                            />
                            <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Submitted
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="https://github.com/your-username/your-repo"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                disabled={submitting}
                                className="flex-1 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        void handleSubmitRepo();
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                onClick={() => void handleSubmitRepo()}
                                disabled={submitting || !repoUrl.trim()}
                                className="kio-btn-ai-primary shrink-0"
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-1" />
                                        Submit Project
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Open Repo Button — only when repo is submitted */}
                {submitted && displayRepoUrl && (
                    <Button
                        className="w-full kio-btn-ai-primary"
                        onClick={() => window.open(displayRepoUrl, '_blank')}
                    >
                        Open GitHub Repo
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
