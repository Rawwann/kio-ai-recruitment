'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Loader2, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/forms/input';
import { Button } from '@/components/ui/forms/button';
import { Skeleton } from '@/components/ui/feedback/skeleton';
import { ProjectsGrid } from '@/components/features/candidates/ProjectsGrid';
import { getAvailableProjects } from '@/lib/api/candidateService';
import type { AvailableProject } from '@/types/candidate';
import { PageShell } from '@/components/shared/PageShell';

// ─── Filter constants ────────────────────────────────────────────────────────

const ROLES   = ['All Roles',   'Frontend', 'Backend', 'Full Stack', 'UI/UX'];
const LEVELS  = ['All Levels',  'Easy', 'Medium', 'Hard'];

/** Map Django difficulty_level → human-readable label for filter matching. */
function normalizeLevel(raw?: string): string {
    if (!raw) return '';
    const l = raw.toLowerCase().trim();
    if (l === 'junior'   || l === 'beginner' || l === 'easy')     return 'easy';
    if (l === 'middle'   || l === 'intermediate' || l === 'medium') return 'medium';
    if (l === 'senior'   || l === 'advanced' || l === 'hard')     return 'hard';
    return l;
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────

function ProjectsSkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[11px] border-2 border-white/90 bg-white/70 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const [projects, setProjects]           = useState<AvailableProject[]>([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState<string | null>(null);
    const [search, setSearch]               = useState('');
    const [selectedRole, setSelectedRole]   = useState('All Roles');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters: Record<string, string> = {};
            if (search.trim()) filters.search = search.trim();
            // Level goes to API; role is client-side only
            if (selectedLevel !== 'All Levels') filters.level = selectedLevel;

            const { projects: data } = await getAvailableProjects(1, 50, filters);
            setProjects(data);
        } catch (err) {
            setError('Failed to load projects. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch only when search or level changes (role is filtered client-side)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProjects();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, selectedLevel]);

    // Client-side filtering: search (fallback) + role (primary) + level (fallback)
    const filtered = useMemo(() => {
        return projects.filter((p) => {
            const matchSearch =
                search === '' ||
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.company_name?.toLowerCase().includes(search.toLowerCase());

            // Role matching: client-side only per user specification
            let matchRole = true;
            if (selectedRole !== 'All Roles') {
                const roleLower = selectedRole.toLowerCase();
                const isTeam = p.isTeamProject ?? p.is_team_project ?? false;
                const roles = Array.isArray(p.teamRoles)
                    ? (p.teamRoles as { role: string }[]).map(r => r.role?.toLowerCase() ?? '')
                    : [];

                if (roleLower === 'frontend') {
                    matchRole = roles.some(r => r.includes('frontend'));
                } else if (roleLower === 'backend') {
                    matchRole = roles.some(r => r.includes('backend'));
                } else if (roleLower === 'ui/ux') {
                    matchRole = roles.some(r => r.includes('ui') || r.includes('ux') || r.includes('uiux'));
                } else if (roleLower === 'full stack') {
                    matchRole = !isTeam;
                }
            }

            // Level: normalize both Django camelCase (Junior/Intermediate/Senior) and DB values
            const diffLevel = p.difficultyLevel ?? p.difficulty_level;
            const matchLevel =
                selectedLevel === 'All Levels' ||
                normalizeLevel(diffLevel) === selectedLevel.toLowerCase();

            return matchSearch && matchRole && matchLevel;
        });
    }, [projects, search, selectedRole, selectedLevel]);

    return (
        <PageShell className="min-h-full" padding="default">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="bg-accent p-2 rounded-lg text-primary">
                        <Briefcase size={20} />
                    </div>
                    Available Projects
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Discover assessment projects that match your skills and interests
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-xl mb-6 bg-card/50 border-2 border-white/80 shadow-sm backdrop-blur"
            >
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects or companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-card"
                    />
                </div>

                {/* Role filter */}
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer select-none min-w-[160px] border border-border bg-card"
                    onClick={() => {
                        const idx = ROLES.indexOf(selectedRole);
                        setSelectedRole(ROLES[(idx + 1) % ROLES.length]);
                    }}
                >
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedRole}</span>
                </div>

                {/* Level filter */}
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer select-none min-w-[160px] border border-border bg-card"
                    onClick={() => {
                        const idx = LEVELS.indexOf(selectedLevel);
                        setSelectedLevel(LEVELS[(idx + 1) % LEVELS.length]);
                    }}
                >
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{selectedLevel}</span>
                </div>
            </div>

            {/* Results count */}
            {!loading && !error && (
                <p className="text-sm text-foreground mb-5">
                    Showing{' '}
                    <span className="text-primary font-medium">{filtered.length}</span>{' '}
                    project{filtered.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* Content */}
            {loading ? (
                <ProjectsSkeletonGrid />
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={fetchProjects} variant="outline">
                        <Loader2 className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                    <p className="text-muted-foreground text-base">
                        No projects found matching your criteria.
                    </p>
                </div>
            ) : (
                <ProjectsGrid projects={filtered} />
            )}
        </PageShell>
    );
}