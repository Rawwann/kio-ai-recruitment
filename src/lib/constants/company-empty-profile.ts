import type { CompanyProfile } from "@/types/company";

/** Neutral shell before GET /api/users/profile/ hydrates the company workspace. */
export function createEmptyCompanyProfile(): CompanyProfile {
    return {
        id: "",
        name: "",
        website: "",
        location: "",
        industry: "",
        about: "",
        tags: [],
        team: [],
        billing: {
            currentPlan: {
                name: "—",
                price: 0,
                cycle: "monthly",
                features: [],
                nextBillingDate: "",
                isPopular: false,
            },
            history: [],
        },
        paymentMethods: [],
        notifications: {
            email: {
                newApplications: true,
                projectUpdates: true,
                teamInvites: true,
                weeklyDigest: false,
                marketingEmails: false,
            },
            ai: {
                candidateMatching: true,
                riskAlerts: true,
                performanceInsights: true,
                autoScreening: true,
            },
        },
    };
}
