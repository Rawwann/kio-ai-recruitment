// types/candidate.ts

// ─── Dashboard & Simulations ─────────────────────────────────────────────────

export interface CandidateStats {
    activeSimulations: number;
    applicationsSent: number;
    profileStrength: number; // 0–100 (was string "85%", now a number)
    github_connected: boolean;
}

export interface ActiveSimulation {
    id: string;
    title: string;
    description: string;
    githubRepoUrl: string;
    starterTemplate?: string;  // company's starter template repo URL
    deadline: string;        // ISO date string
    timeRemaining?: string;  // e.g., "03h : 45m"
}

export interface ApplicationHistoryItem {
    id: string;
    projectId?: string;
    jobTitle: string;
    company: string;
    appliedAt: string;       // ISO date string
    status: 'inprogress' | 'passed' | 'under_review' | 'not_selected';
}

// ─── Available Projects ──────────────────────────────────────────────────────

export interface AvailableProject {
    id: number;
    company_name: string;
    title: string;
    description: string;
    // List view extras
    role?: string;               // e.g. "Frontend Developer"
    difficulty_level?: string;   // snake_case alias (some endpoints)
    difficultyLevel?: string;    // camelCase from ProjectSerializer ("Junior" | "Intermediate" | "Senior")
    days_left?: number;          // numeric countdown
    estimated_hours?: string;    // e.g. "3-4 hours"
    required_skills?: string[] | string;  // array from API or legacy string
    requiredSkills?: string | string[];  // array or comma-separated legacy
    instructions?: string;
    visibility?: 'public' | 'private';
    createdAt?: string;
    deadline?: string | null;
    daysLeft?: number;           // camelCase alias for days_left
    projectType?: string;
    /** Whether this is a team project (from Django serialiser). */
    is_team_project?: boolean;
    /** camelCase alias from ProjectSerializer */
    isTeamProject?: boolean;
    /** Team role definitions — array of { role, count } objects */
    teamRoles?: { role: string; count: number }[] | Record<string, unknown>;
}

export interface TaskRequirement {
    title: string;
    description: string;
}

export interface ProjectDetails extends AvailableProject {
    /** From GET /api/projects/:id/ when the viewer is a candidate. */
    hasApplied?: boolean;
    overview?: string;
    additional_skills?: string[] | string;
    goals?: string[] | string;
    tasks_requirements?: TaskRequirement[] | string;
    deliverables?: string[] | string;
    next_steps?: string[] | string;
    starterTemplate?: string;   // company starter repo URL
}

export interface ApplyToProjectResponse {
    success: boolean;
    message: string;
    application_id?: number;
}

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: 'male' | 'female' | 'other';
    address: string;
    education: string;
    years_of_experience: number;
    skills: string[];
    interests: string;
    category: 'frontend' | 'backend' | 'uiux' | 'fullstack';
    role?: string;
    cv_file_name?: string;
    cv_uploaded_at?: string;
    /** Absolute URL returned by Django for inline preview and download */
    cv_file_url?: string;
    avatar_url?: string;
    profile_completion_percentage: number;
}

export interface UpdateProfilePayload {
    full_name?: string;
    phone_number?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    education?: string;
    years_of_experience?: number;
    skills?: string[];
    interests?: string;
    category?: 'frontend' | 'backend' | 'uiux' | 'fullstack';
    role?: string;
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface UploadCVResponse {
    file_name: string;
    uploaded_at: string;
    file_url: string;
    /** Role parsed from CV by the AI parser (may be empty). */
    parsed_role?: string;
}

// ─── GitHub Integration ──────────────────────────────────────────────────────

export interface GitHubStatus {
    connected: boolean;
    username?: string;
    avatarUrl?: string;
}

export interface GitHubConnectPayload {
    code: string;
    /** Must match the redirect_uri used in the /authorize request (see getGitHubOAuthRedirectUri). */
    redirect_uri?: string;
}

export interface GitHubConnectResponse {
    success: boolean;
    username?: string;
    avatarUrl?: string;
    message?: string;
}
