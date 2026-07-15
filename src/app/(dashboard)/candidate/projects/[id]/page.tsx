'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ChevronLeft, Clock, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/feedback/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/overlays/dialog';
import { Button } from '@/components/ui/forms/button';
import { getProjectDetails, applyToProject } from '@/lib/api/candidateService';
import { ApiError } from '@/lib/api/apiClient';
import { normalizeSkillList } from '@/lib/utils/projectSkills';
import type { ProjectDetails } from '@/types/candidate';

function parseProjectIdParam(
    raw: string | string[] | undefined,
): number | null {
    const s = Array.isArray(raw) ? raw[0] : raw;
    if (s == null || s === "") return null;
    const n = Number(s);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
            {children}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <Skeleton className="h-7 w-44 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton className="w-16 h-16 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-64" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-7 w-24 rounded-full" />
                            <Skeleton className="h-7 w-28 rounded-full" />
                            <Skeleton className="h-7 w-20 rounded-full" />
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm space-y-3">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="rounded-2xl h-80 w-full" />
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-7 w-20 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function safeString(v: unknown, fallback = ''): string {
    if (v == null) return fallback;
    if (typeof v === 'string') return v;
    return String(v);
}

/** Backend may return arrays, newline-separated text, or omit fields. */
function toLineItems(v: unknown): string[] {
    if (Array.isArray(v)) {
        return v.map((x) => safeString(x).trim()).filter(Boolean);
    }
    if (typeof v === 'string' && v.trim()) {
        return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
}

function toTaskList(v: unknown): { title: string; description: string }[] {
    if (typeof v === 'string' && v.trim()) {
        return [{ title: 'Tasks & requirements', description: v.trim() }];
    }
    if (!Array.isArray(v)) return [];
    return v
        .map((item) => {
            if (item && typeof item === 'object' && 'title' in (item as object)) {
                const t = item as { title?: unknown; description?: unknown };
                return {
                    title: safeString(t.title, 'Requirement') || 'Requirement',
                    description: safeString(t.description),
                };
            }
            return { title: 'Requirement', description: safeString(item) };
        })
        .filter((row) => row.title || row.description);
}

function toSkillTags(v: unknown): string[] {
    if (Array.isArray(v)) {
        return v.map((x) => safeString(x).trim()).filter(Boolean);
    }
    if (typeof v === 'string' && v.trim()) {
        return v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const routeProjectId = parseProjectIdParam(params?.id);

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    /** True while POST /apply/ is in flight (from the submit step in the dialog). */
    const [applying, setApplying] = useState(false);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    /** Set after a successful 201 response (before redirect). */
    const [justSubmitted, setJustSubmitted] = useState(false);
    /** Set when API returns 400 for duplicate application. */
    const [applyDuplicate, setApplyDuplicate] = useState(false);

    const loadProject = async () => {
        if (routeProjectId == null) {
            setLoading(false);
            setError('This project link is invalid.');
            return;
        }
        setLoading(true);
        setError(null);
        setApplyDuplicate(false);
        try {
            const data = await getProjectDetails(routeProjectId);
            setProject(data);
        } catch (err) {
            setError('Failed to load project details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadProject();
    }, [routeProjectId]);

    const resolveApplicationProjectId = (): number | null => {
        const idToApply = project?.id != null ? Number(project.id) : routeProjectId;
        if (idToApply == null || !Number.isFinite(idToApply) || idToApply <= 0) return null;
        return idToApply;
    };

    const handleOpenApplyDialog = () => {
        if (justSubmitted || project?.hasApplied || applyDuplicate) return;
        if (resolveApplicationProjectId() == null) {
            toast.error("Invalid project. Open this page from the project list and try again.");
            return;
        }
        setApplyDialogOpen(true);
    };

    const handleSubmitApplication = async () => {
        if (justSubmitted || project?.hasApplied || applyDuplicate) return;
        const idToApply = resolveApplicationProjectId();
        if (idToApply == null) {
            toast.error("Invalid project. Open this page from the project list and try again.");
            return;
        }

        setApplying(true);
        try {
            const response = await applyToProject(idToApply);
            setApplyDialogOpen(false);
            toast.success(response.message || "Application submitted successfully!");
            setJustSubmitted(true);
            setTimeout(() => router.push("/candidate/dashboard"), 2000);
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 400) {
                const m = (err.message || "").toLowerCase();
                if (m.includes("already") || m.includes("applied")) {
                    setApplyDialogOpen(false);
                    setApplyDuplicate(true);
                    toast.info(err.message || "You have already applied to this project.");
                    return;
                }
            }
            toast.error(err instanceof Error ? err.message : "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <LoadingSkeleton />;

    if (error || !project) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{error ?? 'Project not found'}</h2>
                    <p className="text-gray-600 mb-6">We couldn't load the project details. Please try again.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={loadProject}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Retry
                        </button>
                        <Link
                            href="/candidate/projects"
                            prefetch={true}
                            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Back to Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const requiredSkillsList = normalizeSkillList(project.required_skills, project.requiredSkills);

    const companyName = safeString(project.company_name, 'Company').trim() || 'Company';
    const companyInitials = (companyName.slice(0, 2) || '—').toUpperCase();
    const projectTitle = safeString(project.title, 'Project').trim() || 'Project';
    const overviewText =
        safeString(project.overview).trim() ||
        safeString(project.description).trim() ||
        'No overview has been provided for this project yet.';

    const goals = toLineItems(project.goals);
    const tasksList = toTaskList(project.tasks_requirements);
    const deliverables = toLineItems(project.deliverables);
    const nextSteps = toLineItems(project.next_steps);
    const additionalSkills = toSkillTags(project.additional_skills);

    const hasAppliedFromApi = !!project.hasApplied;
    const applyLocked = applying || hasAppliedFromApi || justSubmitted || applyDuplicate;
    const applyButtonLabel = applying
        ? "Submitting..."
        : justSubmitted
            ? "Applied ✓"
            : hasAppliedFromApi || applyDuplicate
                ? "Already applied"
                : "Apply now";
    const applyButtonClass = justSubmitted
        ? "bg-green-500 cursor-not-allowed text-white"
        : hasAppliedFromApi || applyDuplicate
            ? "bg-white/20 cursor-not-allowed text-purple-100"
            : applying
                ? "bg-white/90 text-purple-700 cursor-wait"
                : "bg-white text-purple-700 hover:bg-purple-50 active:scale-95";

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Back Navigation */}
            <Link
                href="/candidate/projects"
                prefetch={true}
                className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 mb-8 transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium text-lg">Back to projects</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Main Content ────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Project Header */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                                {companyInitials}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{companyName}</p>
                                <h1 className="text-2xl font-bold text-gray-900">{projectTitle}</h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            {project.difficulty_level && (
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                    {project.difficulty_level}
                                </span>
                            )}
                            {project.role && (
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                                    {project.role}
                                </span>
                            )}
                            {project.days_left != null && (
                                <div className="flex items-center gap-1 text-gray-600 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{project.days_left} days left</span>
                                </div>
                            )}
                            {project.estimated_hours && (
                                <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600 text-sm">{project.estimated_hours}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Project Overview */}
                    <Section title="Project Overview">
                        <p className="text-gray-700 leading-relaxed">{overviewText}</p>
                    </Section>

                    {/* Project Goals */}
                    {goals.length > 0 && (
                        <Section title="Project Goals">
                            <ul className="space-y-3">
                                {goals.map((goal, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {/* Tasks & Requirements */}
                    {tasksList.length > 0 && (
                        <Section title="Tasks & Requirements">
                            <div className="space-y-6">
                                {tasksList.map((task, index) => (
                                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">{task.title || '—'}</h3>
                                        <p className="text-gray-600">{task.description || '—'}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Expected Deliverables */}
                    {deliverables.length > 0 && (
                        <Section title="Expected Deliverables">
                            <ol className="space-y-3">
                                {deliverables.map((deliverable, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold shrink-0">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700">{deliverable}</span>
                                    </li>
                                ))}
                            </ol>
                        </Section>
                    )}

                    {/* What Happens Next */}
                    {nextSteps.length > 0 && (
                        <Section title="What Happens Next?">
                            <ul className="space-y-3">
                                {nextSteps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}
                </div>

                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Apply Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-8 left-8 opacity-20">
                                <Sparkles className="w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-light mb-4 relative z-10">Ready to Apply?</h2>

                            <p className="text-purple-100 text-base leading-relaxed mb-8 relative z-10">
                                Click <span className="font-medium text-white">Apply now</span> to submit your
                                application. After you're accepted, you'll be able to submit your work repository.
                            </p>

                            <button
                                type="button"
                                onClick={handleOpenApplyDialog}
                                disabled={applyLocked}
                                className={`w-full py-4 rounded-lg font-medium text-lg transition-all relative z-10 flex items-center justify-center gap-2 ${applyButtonClass}`}
                            >
                                {applying && <Loader2 className="h-5 w-5 animate-spin" />}
                                {applyButtonLabel}
                            </button>

                            {project.days_left != null && (
                                <p className="text-center text-purple-200 text-xs mt-4 relative z-10">
                                    {project.days_left} days left to submit
                                </p>
                            )}
                        </div>

                        {/* Required Skills */}
                        {requiredSkillsList.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {requiredSkillsList.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Skills */}
                        {additionalSkills.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4">Additional Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {additionalSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                open={applyDialogOpen}
                onOpenChange={(open) => {
                    setApplyDialogOpen(open);
                }}
            >
                <DialogContent className="sm:max-w-lg" showCloseButton={!applying}>
                    <DialogHeader>
                        <DialogTitle>Project Summary &amp; Resources</DialogTitle>
                        <DialogDescription>
                            To start this project, please use the official company starter template.
                            You will be able to submit your repository link once your application is accepted.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Project brief */}
                        <div className="rounded-lg border border-purple-100 bg-purple-50/40 p-4 space-y-1">
                            <p className="text-sm font-semibold text-gray-900">{projectTitle}</p>
                            <p className="text-xs text-gray-500">{companyName}</p>
                            {project.difficulty_level && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                                    {project.difficulty_level}
                                </span>
                            )}
                        </div>

                        {/* Starter Template Link */}
                        {project.starterTemplate && (
                            <a
                                href={project.starterTemplate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-purple-200 bg-white text-purple-700 text-sm font-medium hover:bg-purple-50 transition-colors"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                                View Starter Template on GitHub
                            </a>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setApplyDialogOpen(false)}
                            disabled={applying}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => void handleSubmitApplication()}
                            disabled={applying}
                            className="kio-btn-ai-primary"
                        >
                            {applying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Apply Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
