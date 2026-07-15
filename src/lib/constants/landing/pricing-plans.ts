export interface PricingPlan {
    name: string;
    desc: string;
    features: string[];
    highlight: boolean;
    /** Backend plan name used by the Stripe checkout endpoint (Starter | Growth | Enterprise). */
    backendPlan: string;
}

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: "Start",
        desc: "For companies beginning their journey with project-based technical hiring",
        features: ["Up to 5 active projects", "GitHub integration", "Basic AI code analysis", "Candidate tracking", "Individual assessments", "LinkedIn profile import", "Email support"],
        highlight: false,
        backendPlan: "Starter",
    },
    {
        name: "Advance",
        desc: "For growing teams scaling their technical recruitment with automation",
        features: ["Unlimited active projects", "Plagiarism & complexity metrics", "Team collaboration tools", "GitHub activity monitoring", "Custom evaluation criteria", "Cheating detection", "Priority support"],
        highlight: true,
        backendPlan: "Growth",
    },
    {
        name: "Optimize",
        desc: "For enterprises seeking deep insights and seamless integration",
        features: ["Advanced analytics dashboard", "Custom reports & data export", "Multi-team management", "Historical performance tracking", "API access", "Dedicated onboarding", "Fairness & bias tools"],
        highlight: false,
        backendPlan: "Enterprise",
    }
];