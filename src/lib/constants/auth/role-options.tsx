import { Briefcase, User } from "lucide-react";
import React from "react";

export interface RoleOption {
    value: "recruiter" | "candidate";
    label: string;
    description: string;
    icon: React.ReactNode;
}

export const ROLE_OPTIONS: RoleOption[] = [
    {
        value: "recruiter",
        label: "Recruiter",
        description: "I want to hire talent",
        icon: <Briefcase className="w-12 h-12 text-primary" />,
    },
    {
        value: "candidate",
        label: "Candidate",
        description: "I'm looking for opportunities",
        icon: <User className="w-12 h-12 text-primary" />,
    },
];