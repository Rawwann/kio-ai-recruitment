import { NotificationRow } from "@/types";

export const EMAIL_NOTIFICATIONS: NotificationRow[] = [
    { key: "newApplications", label: "New Applications", description: "Get notified when a candidate applies to your job postings." },
    { key: "projectUpdates", label: "Project Updates", description: "Receive emails when a project status changes." },
    { key: "teamInvites", label: "Team Invitations", description: "Be notified when someone accepts or rejects your team invite." },
    { key: "weeklyDigest", label: "Weekly Digest", description: "A summary of your activity sent every Monday morning." },
    { key: "marketingEmails", label: "Marketing & Promotions", description: "Tips, news, and product updates from the KIO team." },
];

export const AI_NOTIFICATIONS: NotificationRow[] = [
    { key: "candidateMatching", label: "AI Candidate Matching", description: "Get alerts when AI finds a high-match candidate for your roles." },
    { key: "riskAlerts", label: "Risk Alerts", description: "Receive warnings for candidates flagged by the AI risk assessment." },
    { key: "performanceInsights", label: "Performance Insights", description: "Weekly AI-generated insights on your recruitment funnel." },
    { key: "autoScreening", label: "Auto-Screening Results", description: "Notifications when AI completes an automated candidate screening." },
];