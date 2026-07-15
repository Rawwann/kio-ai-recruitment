import { BillingPlan, PaymentMethod, BillingHistoryItem } from "./billing";

export type TeamMemberStatus = "active" | "pending" | "inactive";
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    status: TeamMemberStatus;
    avatar?: string;
    joinedAt: string; // ISO date string
}

export interface NotificationSettings {
    email: {
        newApplications: boolean;
        projectUpdates: boolean;
        teamInvites: boolean;
        weeklyDigest: boolean;
        marketingEmails: boolean;
    };
    ai: {
        candidateMatching: boolean;
        riskAlerts: boolean;
        performanceInsights: boolean;
        autoScreening: boolean;
    };
}

export interface CompanyProfile {
    id: string;
    name: string;
    website: string;
    location: string;
    industry: string;
    size?: CompanySize;
    about: string;
    logoUrl?: string;
    tags: string[]; // industry sub-tags
    foundedYear?: number;
    linkedinUrl?: string;
    team: TeamMember[];
    billing: {
        currentPlan: BillingPlan;
        history: BillingHistoryItem[];
        /** False (or absent) → show plan-selection UI; true → show active plan card */
        hasActiveSubscription?: boolean;
    };
    paymentMethods: PaymentMethod[];
    notifications: NotificationSettings;
}
