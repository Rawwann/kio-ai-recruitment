export interface Applicant {
    id: string;
    /** Django `User` PK when row comes from `ProjectApplication.candidate` (talent-pool deep links). */
    candidateUserId?: string;
    /** From `ProjectApplication.repo_url` (submission / GitHub repo). */
    repoUrl?: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    cvUrl?: string;
    evaluationError?: string | null;
    submissionDate: string;
    aiScore: number | null;
    status: "Passed" | "Failed" | "In Review" | "Flagged";
    commits?: { id: string; message: string; time: string }[];
    radarData?: { subject: string; A: number; fullMark: number }[];
    risk?: {
        isSafe: boolean;
        trustScore: number;
        logs: { id: number; action: string; time: string; isWarning: boolean }[];
    };
    insights?: {
        strengths: string[];
        improvements: string[];
    };
    gradingWeights?: {
        code_quality: number;
        efficiency: number;
        role_fit: number;
        problem_solving: number;
    };
    aiFeedbackPositive?: string[];
    aiFeedbackImprovements?: string[];
}

export interface Project {
    id: string;
    title: string;
    type: "Individual" | "Team";
    status: "Active" | "Draft" | "Completed";
    applicants: number;
    passed: number;
    daysLeft: number;
    progress: number;
    link: string;
    createdAt: number;
    starterTemplate?: string;
    baseRepo?: string;
    passingScore?: number;
    description?: string;
    difficulty?: string;
    teamRoles?: { role: string; count: number }[];
    applicantsList?: Applicant[];
    tags?: string[];

    // DB original fields
    companyId?: string; // FKey to User
    skillsRequired?: string[];
    deadline?: string; // ISO date string
}

export interface Submission {
    id: string;
    projectId: string;
    candidateId: string;
    status: string;
    score?: number;
    feedback?: string;
    submittedAt: string;
}

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { BillingPlan, PaymentMethod, BillingHistoryItem } from "./billing";
import { CompanyProfile, NotificationSettings, TeamMember } from "./company";
import confetti from "canvas-confetti";
type ConfettiOptions = confetti.Options;
type ConfettiGlobalOptions = confetti.GlobalOptions;

export type RoleType = "ADMIN" | "RECRUITER" | "CANDIDATE";
export type ProjectStatusType = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionStatusType = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;
}

export interface MovingBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    borderRadius?: string;
    children: React.ReactNode;
    as?: React.ElementType;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
}

export interface MovingBorderProps {
    children: React.ReactNode;
    duration?: number;
    rx?: string;
    ry?: string;
    [key: string]: unknown;
}

export interface Step {
    id: number;
    label: string;
    description: string;
    completed: boolean;
    active: boolean;
}

export interface CVLoadingScreenProps {
    onComplete: () => void;
}

export interface ActiveSimulationCardProps {
    title: string;
    description: string;
    deadline: string;
    avatars: Array<{ src: string; initials: string }>;
    additionalCount?: number;
}

export interface ApplicationHistoryItem {
    id: string;
    role: string;
    company: string;
    date: string;
    status: 'passed' | 'inprogress' | 'under_review' | 'not_selected';
    icon?: string;
}

export interface ApplicationHistoryTableProps {
    items: ApplicationHistoryItem[];
}

export interface TaskItem {
    id: string;
    date: string;
    month: string;
    day: number;
    title: string;
    time: string;
}

export interface RightInfoPanelProps {
    tasks?: TaskItem[];
}

export interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

export type TabKey = "general" | "team" | "billing" | "notifications" | "security";

export interface ChartsSectionProps {
    tracksMonth: string;
    setTracksMonth: (val: string) => void;
    appsRange: string;
    setAppsRange: (val: string) => void;
    /** When set, pie uses live API category distribution (percentages computed in UI). */
    tracksDistribution?: { name: string; value: number }[];
    /** When set, velocity chart uses backend time series. */
    applicationsOverTime?: { month: string; count?: number; apps?: number }[];
}

export interface LiveFeedProps {
    funnelPeriod: string;
    setFunnelPeriod: (val: string) => void;
    alertsSort: string;
    setAlertsSort: (val: string) => void;
    funnel?: Record<string, { stage: string; count: number }[]>;
    topPerformers: import("@/lib/constants/dashboard/live-feed-data").TopPerformer[];
    alerts: import("@/lib/constants/dashboard/live-feed-data").RecruitmentAlert[];
}

export interface WorkflowCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
}

export interface AnimatedListProps {
    className?: string;
    children: React.ReactNode;
    delay?: number;
}

export interface BorderBeamProps {
    className?: string;
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    borderWidth?: number;
}

export type Api = {
    fire: (options?: ConfettiOptions) => void;
};

export type Props = React.ComponentPropsWithRef<"canvas"> & {
    options?: ConfettiOptions;
    globalOptions?: ConfettiGlobalOptions;
    manualstart?: boolean;
    children?: ReactNode;
};

export type ConfettiRef = Api | null;

export interface RetroGridProps {
    className?: string;
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;
}

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    shimmerColor?: string;
    shimmerSize?: string;
    borderRadius?: string;
    shimmerDuration?: string;
    background?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface SignupStepperProps {
    currentStep: number;
    role: 'recruiter' | 'candidate' | null;
}

export interface Step1RoleProps {
    selectedRole?: "recruiter" | "candidate" | null;
    onRoleSelect: (role: "recruiter" | "candidate") => void;
}

export interface Step2DetailsProps {
    onValidityChange?: (isValid: boolean) => void;
}

export interface Step3CVProps {
    onFileUploaded?: (file: File) => void;
}

export interface AnimatedTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
    tabClassName?: string;
    activeTabClassName?: string;
}

export type Tab = {
    id: string;
    label: string;
};

export interface BillingTabProps {
    plan: BillingPlan;
    paymentMethods: PaymentMethod[];
    history: BillingHistoryItem[];
    loading: boolean;
    /** When false/undefined the tab renders plan-selection UI instead of the active plan card */
    hasSubscription?: boolean;
    /** Called when the user picks a plan from the selection UI (triggers Stripe checkout) */
    onSelectPlan?: (planName: string) => void;
    /** The plan name currently being redirected to Stripe (shows spinner on that button) */
    isSelectingPlan?: string | null;
    onDeletePaymentMethod: (id: string) => void;
    onAddPaymentMethod: (card: PaymentMethod) => void;
    onPlanSwitch: (plan: BillingPlan) => void;
}

export interface GeneralInfoTabProps {
    data: CompanyProfile;
    loading: boolean;
    onSave: (updates: Partial<CompanyProfile>) => Promise<void>;
    onCancel: () => void;
    onSyncSuccess?: (updates: Partial<CompanyProfile>) => void;
    onChange?: (updates: Partial<CompanyProfile>) => void;
    onLogoChange?: (logoUrl: string) => void;
}

export interface NotificationsTabProps {
    notifications: NotificationSettings;
    loading: boolean;
}

export interface NotificationRow {
    key: string;
    label: string;
    description: string;
}

export interface TeamMembersTabProps {
    members: TeamMember[];
    loading: boolean;
    onDeleteMember: (id: string) => void;
    onInviteMember?: (email: string, role: string) => void;
}

export interface ProjectContextType {
    projects: Project[];
    addProject: (project: Project) => void;
    updateProject: (id: string, updatedData: Partial<Project>) => void;
    updateCandidateStatus: (candidateId: string, status: Applicant["status"]) => void;
    /** Reload projects from `GET /api/projects/` (no localStorage). */
    refreshProjects: () => Promise<void>;
    projectsLoading: boolean;
}



































export interface SidebarLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}
