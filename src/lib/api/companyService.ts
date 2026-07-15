/**
 * companyService.ts — company-facing API calls via Next.js BFF → Django.
 */

import { apiFetch } from '@/lib/api/apiClient';
import type { CompanyProfile } from '@/types/company';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CompanyDashboardStats {
    total_projects: number;
    total_applicants: number;
    total_hired: number;
    active_projects: number;
    active_campaigns: number;
    simulations_passed: number;
    needs_review: number;
    tracks_distribution: { name: string; value: number }[];
    applications_over_time: { month: string; count: number; apps: number }[];
    funnel: Record<string, { stage: string; count: number }[]>;
    top_performers: Array<{
        position: number;
        name: string;
        role: string;
        score: string;
        time: string;
    }>;
    alerts: Array<{
        title: string;
        desc: string;
        time: string;
        icon: string;
        bgColor: string;
        priority: 'high' | 'medium' | 'low';
        timestamp: number;
    }>;
    team_collaboration: unknown[];
}

export interface CompanyProject {
    id: number;
    title: string;
    description: string;
    visibility?: string;
    status?: 'draft' | 'published' | 'closed' | string;
    applicants: number;
    passed: number;
    days_left: number;
    progress: number;
    created_at: string;
    deadline?: string;
    difficulty_level?: string;
    /** From `ProjectSerializer` read path */
    difficultyLevel?: string;
    required_skills?: string[];
    role?: string;
    /** Django `Project.is_team_project` (list/detail serialisers) */
    isTeamProject?: boolean;
    is_team_project?: boolean;
    teamRoles?: { role: string; count: number }[] | Record<string, unknown>;
    starterTemplate?: string;
    baseRepo?: string;
    /** Serialized day count (detail) */
    daysLeft?: number;
    passingScore?: number;
    tags?: string[];
}

/** Keys align with Django `ProjectSerializer` (camelCase). */
export interface CreateProjectPayload {
    title: string;
    description: string;
    difficulty_level: 'JUNIOR' | 'MIDDLE' | 'SENIOR';
    requiredSkills: string[];
    /** Persisted to `Project.is_team_project` */
    isTeamProject: boolean;
    role?: string;
    deadline?: string | null;
    visibility?: string;
    overview?: string;
    goals?: string;
    estimatedHours?: number;
    tasksRequirements?: string;
    deliverables?: string;
    nextSteps?: string;
    additionalSkills?: string;
    tags?: string[];
    passingScore?: number;
    starterTemplate?: string;
    baseRepo?: string;
    teamRoles?: { role: string; count: number }[] | null;
    instructions?: string;
    status?: 'draft' | 'published' | 'closed';
}

export interface ProjectApplicant {
    id: number;
    candidate_name: string;
    candidate_email: string;
    applied_at: string;
    status: string;
    score?: number;
    cv_url?: string;
}

/** Company PATCH to `/api/projects/applications/<pk>/update-status/` (aligns with Django `CompanyApplicationUpdateSerializer`). */
export interface UpdateApplicationStatusPayload {
    status?: 'PENDING' | 'TECHNICAL_REVIEW' | 'PASSED' | 'HIRED' | 'NOT_SELECTED' | 'CANCELLED';
    role_fit_score?: number;
    repo_url?: string | null;
}

export interface Candidate {
    id: number;
    full_name: string;
    email: string;
    skills: string[];
    category: string;
    experience: number;
    avatar_url?: string;
}

export interface CompanySearchResult {
    id: string;
    label: string;
    sub?: string;
    href: string;
}

export interface CompanySearchResponse {
    campaigns: CompanySearchResult[];
    applicants: CompanySearchResult[];
    projects: CompanySearchResult[];
}

// ─── Dashboard (single bundle) ───────────────────────────────────────────────

export async function getCompanyStats(): Promise<CompanyDashboardStats> {
    const data = await apiFetch<Record<string, unknown>>('/api/company-stats/');
    const n = (k: string, alt?: string) => {
        const v = data[k] ?? (alt ? data[alt] : undefined);
        return typeof v === 'number' ? v : Number(v) || 0;
    };
    return {
        total_projects: n('totalProjects', 'projectCount'),
        total_applicants: n('totalApplicants', 'total_applicants'),
        total_hired: n('totalHired', 'total_hired'),
        active_projects: n('activeProjects', 'active_projects'),
        active_campaigns: n('activeCampaigns', 'active_campaigns'),
        simulations_passed: n('simulationsPassed', 'simulations_passed'),
        needs_review: n('needsReview', 'needs_review'),
        tracks_distribution: (data.tracksDistribution ?? data.tracks_distribution) as CompanyDashboardStats['tracks_distribution'] ?? [],
        applications_over_time:
            (data.applicationsOverTime ?? data.applications_over_time) as CompanyDashboardStats['applications_over_time'] ?? [],
        funnel: (data.funnel as CompanyDashboardStats['funnel']) ?? {},
        top_performers: (data.topPerformers ?? data.top_performers) as CompanyDashboardStats['top_performers'] ?? [],
        alerts: (data.alerts as CompanyDashboardStats['alerts']) ?? [],
        team_collaboration: (data.teamCollaboration ?? data.team_collaboration) as unknown[] ?? [],
    };
}

export async function searchCompany(q: string): Promise<CompanySearchResponse> {
    const params = new URLSearchParams({ q: q.trim() });
    return apiFetch<CompanySearchResponse>(`/api/users/company/search/?${params}`);
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getCompanyProjects(): Promise<CompanyProject[]> {
    const data = await apiFetch<unknown>('/api/projects/');
    return (data as { results?: CompanyProject[] }).results ?? (data as CompanyProject[]);
}

export async function createProject(payload: CreateProjectPayload): Promise<CompanyProject> {
    return apiFetch<CompanyProject>('/api/projects/', { method: 'POST', body: payload });
}

export async function updateProject(id: number, payload: Partial<CreateProjectPayload>): Promise<CompanyProject> {
    return apiFetch<CompanyProject>(`/api/projects/${id}/`, { method: 'PUT', body: payload });
}

export async function deleteProject(id: number): Promise<void> {
    await apiFetch(`/api/projects/${id}/`, { method: 'DELETE' });
}

export async function getProjectById(id: number): Promise<CompanyProject> {
    return apiFetch<CompanyProject>(`/api/projects/${id}/`);
}

// ─── Applicants / status ─────────────────────────────────────────────────────

export async function getProjectApplicants(projectId: number): Promise<ProjectApplicant[]> {
    const data = await apiFetch<unknown>(`/api/projects/${projectId}/applicants/`);
    return (data as { results?: ProjectApplicant[] }).results ?? (data as ProjectApplicant[]);
}

export async function updateApplicationStatus(
    applicationPk: number,
    payload: UpdateApplicationStatusPayload,
): Promise<void> {
    const body: Record<string, unknown> = {};
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.role_fit_score !== undefined) body.role_fit_score = payload.role_fit_score;
    if (payload.repo_url !== undefined) body.repo_url = payload.repo_url;
    await apiFetch(`/api/projects/applications/${applicationPk}/update-status/`, {
        method: 'PATCH',
        body,
    });
}

// ─── Company profile ──────────────────────────────────────────────────────────

export async function getCompanyProfile(): Promise<CompanyProfile> {
    const data = await apiFetch<Record<string, unknown>>('/api/users/profile/');
    return (data.company_profile ?? data) as CompanyProfile;
}

export async function updateCompanyProfile(payload: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const data = await apiFetch<Record<string, unknown>>('/api/users/profile/', { method: 'PUT', body: payload });
    return (data.company_profile ?? data) as CompanyProfile;
}

// ─── Candidates (talent pool) ──────────────────────────────────────────────

export async function getCandidates(): Promise<Candidate[]> {
    const data = await apiFetch<unknown>('/api/users/candidates/');
    return (data as { results?: Candidate[] }).results ?? (data as Candidate[]);
}
