import { IconLogin, IconGitBranch, IconClipboardList, IconCheck, IconChartBar } from "@tabler/icons-react";
import React from "react";

export interface WorkflowStep {
    title: string;
    desc: string;
    icon: React.ReactNode;
}

export const CANDIDATE_STEPS: WorkflowStep[] = [
    {
        title: "Sign up",
        desc: "Create your account in minutes and gain immediate access to our intuitive dashboard.",
        icon: <IconLogin className="h-6 w-6 text-purple-700" />
    },
    {
        title: "Work on real projects",
        desc: "Candidates join real-world project simulations while recruiters track progress and collaboration.",
        icon: <IconGitBranch className="h-6 w-6 text-purple-700" />
    },
    {
        title: "Get evaluated",
        desc: "Your work is analyzed and reflected in performance scores and insights.",
        icon: <IconClipboardList className="h-6 w-6 text-purple-700" />
    },
];

export const RECRUITER_STEPS: WorkflowStep[] = [
    {
        title: "Sign up",
        desc: "Create your account in minutes and gain immediate access to our intuitive dashboard.",
        icon: <IconLogin className="h-6 w-6 text-purple-700" />
    },
    {
        title: "Track candidate performance",
        desc: "Monitor progress, collaboration, and GitHub activity in real time.",
        icon: <IconChartBar className="h-6 w-6 text-purple-700" />
    },
    {
        title: "Make hiring decisions",
        desc: "Use dashboards and insights to select the best-fit candidates.",
        icon: <IconCheck className="h-6 w-6 text-purple-700" />
    },
];