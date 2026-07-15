// ──────────────────────────────────────────────────────────────────
// Feature Blocks Data
// Previously inlined as JSX props directly inside FeaturesSection.
// ──────────────────────────────────────────────────────────────────
export interface FeatureBlockData {
    badge: string;
    title: string;
    desc: string;
    img: string;
    btnText: string;
    isReverse?: boolean;
}

export const featureBlocks: FeatureBlockData[] = [
    {
        badge: "Project-Based Recruitment",
        title: "Evaluate Candidates Through Real-World Projects",
        desc: "The KIO web application enables recruiters to evaluate candidates through realistic project simulations that reflect real workplace tasks.",
        img: "/feature-1.png",
        btnText: "View Projects",
    },
    {
        badge: "Real-Time Analytics",
        title: "Make data-driven hiring decisions instantly",
        desc: "The KIO platform provides recruiters with real-time dashboards that visualize candidate performance and project progress.",
        img: "/feature-2.png",
        btnText: "View Dashboard",
        isReverse: true,
    },
    {
        badge: "Seamless Integrations",
        title: "Integrations That Fit Your Workflow",
        desc: "KIO integrates with industry-relevant platforms like GitHub, LinkedIn, and Slack to improve the realism of technical assessments.",
        img: "/feature-3.png",
        btnText: "Explore Integrations",
    },
];