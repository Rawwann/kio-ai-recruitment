/**
 * candidateService.ts — candidate API via Next.js BFF. Errors bubble to callers (no mock fallbacks).
 */

import { apiFetch } from '@/lib/api/apiClient';
import type {
    CandidateStats,
    ActiveSimulation,
    ApplicationHistoryItem,
    AvailableProject,
    ProjectDetails,
    ApplyToProjectResponse,
    UserProfile,
    UpdateProfilePayload,
    ChangePasswordPayload,
    UploadCVResponse,
    GitHubStatus,
    GitHubConnectPayload,
    GitHubConnectResponse,
} from '@/types/candidate';

// ─── Candidate Stats ──────────────────────────────────────────────────────────
// Backend: GET /api/candidate-stats/
// Response: { applications_sent, active_simulations, profile_strength, certificates_earned }

export async function getCandidateStats(): Promise<CandidateStats> {
    const data = await apiFetch<any>('/api/candidate-stats/');
    return {
        activeSimulations: data.active_simulations ?? data.activeSimulations ?? 0,
        applicationsSent: data.applications_sent ?? data.applicationsSent ?? 0,
        profileStrength: data.profile_strength ?? data.profileStrength ?? 0,
        github_connected: data.github_connected ?? false,
    };
}

// ─── Active Simulations ───────────────────────────────────────────────────────
// Backend: GET /api/my-applications/ filtered by status PENDING | TECHNICAL_REVIEW
// We derive "active simulations" from the applications list.

export async function getActiveSimulations(): Promise<ActiveSimulation[]> {
    const data = await apiFetch<any[]>('/api/my-applications/');
    const activeStatuses = ['PENDING', 'TECHNICAL_REVIEW'];
    return data
        .filter((a) => activeStatuses.includes(a.status))
        .map((a) => ({
            id: String(a.id),
            title: a.project_title ?? a.project?.title ?? 'Untitled',
            description: a.project_description ?? a.project?.description ?? '',
            githubRepoUrl: a.github_repo_url ?? a.repo_url ?? '',
            starterTemplate: a.project?.starterTemplate ?? '',
            deadline: a.project?.deadline ?? a.deadline ?? '',
            timeRemaining: a.time_remaining ?? undefined,
        }));
}

// ─── Application History ──────────────────────────────────────────────────────
// Backend: GET /api/my-applications/

export async function getApplicationHistory(): Promise<ApplicationHistoryItem[]> {
    const data = await apiFetch<any[]>('/api/my-applications/');
    return data.map((a) => ({
        id: String(a.id),
        projectId: String(a.project?.id ?? a.project_id ?? ''),
        jobTitle: a.project_title ?? a.project?.title ?? 'Untitled',
        company: a.company_name ?? a.project?.company_name ?? '—',
        appliedAt: a.applied_at ?? a.created_at ?? new Date().toISOString(),
        status: mapApplicationStatus(a.status),
    }));
}

function mapApplicationStatus(raw: string): ApplicationHistoryItem['status'] {
    const map: Record<string, ApplicationHistoryItem['status']> = {
        PENDING: 'inprogress',
        TECHNICAL_REVIEW: 'under_review',
        PASSED: 'passed',
        HIRED: 'passed',
        NOT_SELECTED: 'not_selected',
        CANCELLED: 'not_selected',
    };
    return map[raw] ?? 'inprogress';
}

// ─── Available Projects (for candidate browser) ───────────────────────────────
// Backend: GET /api/projects/available/

export interface ProjectsFilters {
    search?: string;
    level?: string;
    role?: string;
}

/** Map frontend level labels → Django ?level= values (PascalCase, matching DIFFICULTY_MAP keys). */
const LEVEL_TO_DJANGO: Record<string, string> = {
    easy: 'Junior',
    medium: 'Middle',
    hard: 'Senior',
};

export async function getAvailableProjects(
    page: number = 1,
    limit: number = 8,
    filters: ProjectsFilters = {},
): Promise<{ projects: AvailableProject[]; total: number }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Level: map Easy/Medium/Hard → Junior/Middle/Senior for Django's DIFFICULTY_MAP
    if (filters.level && filters.level !== 'ALL' && filters.level !== 'All Levels') {
        const djangoLevel = LEVEL_TO_DJANGO[filters.level.toLowerCase()] ?? filters.level;
        params.append('level', djangoLevel);
    }

    // Note: role filtering is client-side only — not sent to API
    if (filters.search) params.append('search', filters.search);

    const data = await apiFetch<any>(`/api/projects/available/?${params}`);

    // DEBUG: log raw API response to verify field names & values
    console.log('[getAvailableProjects] raw response:', JSON.stringify(data, null, 2));

    return {
        projects: (data.results ?? data.projects ?? data) as AvailableProject[],
        total: data.count ?? data.total ?? (Array.isArray(data) ? data.length : 0),
    };
}

// ─── Project Details ──────────────────────────────────────────────────────────
// Backend: GET /api/projects/<id>/

export async function getProjectDetails(id: number): Promise<ProjectDetails> {
    const data = await apiFetch<any>(`/api/projects/${id}/`);
    return {
        ...data,
        hasApplied: data.hasApplied ?? data.has_applied ?? false,
    } as ProjectDetails;
}

// ─── Apply to Project ─────────────────────────────────────────────────────────
// Backend: POST /api/projects/<id>/apply/ (optional repo_url for submission link)

export interface ApplyToProjectOptions {
    repoUrl?: string | null;
}

export async function applyToProject(
    id: number,
    options: ApplyToProjectOptions = {},
): Promise<ApplyToProjectResponse> {
    const body: Record<string, unknown> = {};
    if (options.repoUrl != null && String(options.repoUrl).trim() !== "") {
        body.repo_url = String(options.repoUrl).trim();
    }
    const data = await apiFetch<any>(`/api/projects/${id}/apply/`, {
        method: 'POST',
        body: Object.keys(body).length ? body : {},
    });
    return {
        success: true,
        message: data.message ?? 'Application submitted successfully!',
        application_id: data.application_id ?? data.id,
    };
}

// ─── User Profile ─────────────────────────────────────────────────────────────
// Backend: GET/PUT /api/users/profile/

export async function getCandidateProfile(): Promise<UserProfile> {
    const data = await apiFetch<any>('/api/users/profile/');
    // Django's UserProfileSerializer returns:
    //   { id, email, user_type, profile_data: { ...candidate fields... } }
    // Older / social-auth path may still return candidate_profile at the top level.
    const profile = data.profile_data ?? data.candidate_profile ?? {};
    // Django CandidateProfileSerializer uses camelCase: cvFileUrl, cvFileName, cvUploadedAt
    const cvName = profile.cv_file_name ?? profile.cvFileName;
    const cvAt = profile.cv_uploaded_at ?? profile.cvUploadedAt;
    const cvUrl = profile.cv_file_url ?? profile.cvFileUrl;
    return {
        id: String(data.id ?? profile.id ?? ''),
        full_name: profile.fullName ?? profile.full_name ?? '',
        email: data.email ?? profile.email ?? '',
        phone_number: profile.phoneNumber ?? profile.phone_number ?? '',
        date_of_birth: profile.date_of_birth ?? '',
        gender: profile.gender ?? 'other',
        address: profile.address ?? '',
        education: profile.education ?? '',
        years_of_experience: profile.yearsOfExperience ?? profile.years_of_experience ?? 0,
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        interests: profile.interests ?? '',
        category: profile.category ?? 'frontend',
        role: profile.role ?? '',
        cv_file_name: cvName ?? undefined,
        cv_uploaded_at: cvAt ?? undefined,
        cv_file_url: cvUrl ?? undefined,
        avatar_url: profile.avatar_url ?? undefined,
        profile_completion_percentage: profile.profile_completion_percentage ?? 0,
    };
}

export async function updateCandidateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    // Remove email from payload as it's a login credential and read-only
    const { ...safePayload } = payload;
    if ('email' in safePayload) {
        delete (safePayload as any).email;
    }
    // Django UserProfileSerializer.update() reads from request.data['profile_data']
    await apiFetch('/api/users/profile/', { method: 'PUT', body: { profile_data: safePayload } });
    return getCandidateProfile();
}

// ─── CV Upload ────────────────────────────────────────────────────────────────
// Backend: POST /api/users/upload-cv/  (multipart/form-data, field: cv_file)
// Proxied through the binary-safe Next.js route at /api/users/upload-cv/

export async function uploadCandidateCV(file: File): Promise<UploadCVResponse> {
    const formData = new FormData();
    formData.append('cv_file', file);

    // Do NOT set Content-Type manually — the browser adds the multipart
    // boundary automatically when the body is a FormData instance.
    const res = await fetch('/api/users/upload-cv/', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(err.detail ?? `CV upload failed (${res.status})`);
    }

    const data = await res.json();
    return {
        file_name: data.cv_file_name ?? file.name,
        uploaded_at: data.cv_uploaded_at ?? null,
        file_url: data.cv_file_url ?? '',
        parsed_role: data.parsed?.role ?? '',
    };
}

export async function downloadCandidateCV(fileUrl: string, fileName: string): Promise<void> {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ─── Change Password ──────────────────────────────────────────────────────────
// POST /api/users/change-password/ — Django `ChangePasswordSerializer` fields (snake_case)

export async function changeCandidatePassword(payload: ChangePasswordPayload): Promise<void> {
    if (payload.new_password !== payload.confirm_password) {
        throw new Error('Passwords do not match');
    }
    await apiFetch('/api/users/change-password/', {
        method: 'POST',
        body: {
            current_password: payload.current_password,
            new_password: payload.new_password,
            confirm_password: payload.confirm_password,
        },
    });
}

// ─── GitHub Integration ───────────────────────────────────────────────────────
// Backend endpoints (all proxied through /api/users/github/*):
//   GET  /api/users/github/status/     → Django /api/users/github/status/
//   POST /api/users/github/callback/  → Django /api/users/github/callback/ (OAuth code exchange)
//   POST /api/users/github/disconnect/ → Django /api/users/github/disconnect/

function normalizeGitHubStatusPayload(data: Record<string, unknown> | null | undefined): GitHubStatus {
    if (!data || typeof data !== "object") {
        return { connected: false };
    }
    // Django GitHubStatusView returns camelCase: githubConnected, githubUsername, githubAvatarUrl
    const connected = Boolean(
        data.githubConnected ?? data.connected ?? (data as { github_connected?: boolean }).github_connected,
    );
    const username = (data.githubUsername ?? data.username ?? (data as { github_username?: string }).github_username) as
        | string
        | undefined;
    const avatarUrl = (data.githubAvatarUrl ??
        data.avatar_url ??
        data.avatarUrl ??
        (data as { github_avatar_url?: string }).github_avatar_url) as string | undefined;
    return {
        connected,
        username: typeof username === "string" && username ? username : undefined,
        avatarUrl: typeof avatarUrl === "string" && avatarUrl ? avatarUrl : undefined,
    };
}

export async function getGitHubStatus(): Promise<GitHubStatus> {
    // BFF must target Django /api/users/github/status/. On any error (e.g. 404), not connected.
    try {
        const data = (await apiFetch<Record<string, unknown>>("/api/users/github/status/")) as Record<
            string,
            unknown
        >;
        return normalizeGitHubStatusPayload(data);
    } catch {
        return { connected: false };
    }
}

/**
 * Single OAuth callback for GitHub: same value for /authorize, /access_token, Django, and
 * NEXT_PUBLIC_GITHUB_REDIRECT_URI (e.g. http://localhost:3000/candidate/dashboard).
 * Does not vary by page; use `state` in redirectToGitHubAuth to return to Profile, etc.
 */
export function getGitHubOAuthRedirectUri(): string {
    if (typeof window === 'undefined') return '';
    const fromEnv = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI?.trim();
    if (fromEnv) {
        if (fromEnv.startsWith('http://') || fromEnv.startsWith('https://')) {
            return fromEnv.replace(/\/$/, '');
        }
        const path = fromEnv.startsWith('/') ? fromEnv : `/${fromEnv}`;
        return `${window.location.origin}${path}`.replace(/\/$/, '');
    }
    // Fallback for local dev; prefer setting NEXT_PUBLIC_GITHUB_REDIRECT_URI to match .env
    return 'http://localhost:3000/candidate/dashboard';
}

/** Decode `state` from GitHub OAuth callback; only allow in-app paths under /candidate. */
export function safeDecodeGitHubOAuthReturnPath(state: string | null): string {
    if (!state) return '/candidate/dashboard';
    try {
        const p = decodeURIComponent(state);
        if (typeof p !== 'string' || !p.startsWith('/') || p.startsWith('//')) return '/candidate/dashboard';
        const ALLOWED = ['/candidate', '/company'];
        if (!ALLOWED.some((prefix) => p.startsWith(prefix))) return '/candidate/dashboard';
        return p;
    } catch {
        return '/candidate/dashboard';
    }
}

export async function connectGitHub(payload: GitHubConnectPayload): Promise<GitHubConnectResponse> {
    const redirectUri = payload.redirect_uri?.trim() || getGitHubOAuthRedirectUri();
    const body: Record<string, unknown> = { code: payload.code };
    if (redirectUri) {
        body.redirect_uri = redirectUri;
    }
    const data = await apiFetch<any>('/api/users/github/connect/', { method: 'POST', body });
    return {
        success: data.connected ?? data.success ?? false,
        username: data.username ?? undefined,
        avatarUrl: data.avatar_url ?? data.avatarUrl ?? undefined,
        message: data.message ?? undefined,
    };
}

export async function disconnectGitHub(): Promise<void> {
    await apiFetch('/api/users/github/disconnect/', { method: 'POST', body: {} });
}

function normalizeReturnToStatePath(p: string): string {
    const t = p?.trim() || '/candidate/dashboard';
    if (!t.startsWith('/') || t.startsWith('//') || !t.startsWith('/candidate')) {
        return '/candidate/dashboard';
    }
    return t;
}

/**
 * Start GitHub OAuth. Uses one canonical `redirect_uri` (from NEXT_PUBLIC_GITHUB_REDIRECT_URI
 * or `${origin}/candidate/dashboard`) so it matches the GitHub app + Django. Pass `returnToPath`
 * to land the user on that in-app path after the callback (via OAuth `state`).
 */
export function redirectToGitHubAuth(returnToPath: string = '/candidate/dashboard'): void {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? '';
    if (!clientId) {
        throw new Error('NEXT_PUBLIC_GITHUB_CLIENT_ID is not set');
    }
    const redirectUri = getGitHubOAuthRedirectUri();
    const state = encodeURIComponent(normalizeReturnToStatePath(returnToPath));
    const scope = 'read:user user:email public_repo';
    window.location.href =
        `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}`;
}