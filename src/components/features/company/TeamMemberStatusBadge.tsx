"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { TeamMemberStatus } from "@/types";

export const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const StatusBadge = ({ status }: { status: TeamMemberStatus }) => {
    const config = {
        active: { icon: CheckCircle2, label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
        pending: { icon: Clock, label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        inactive: { icon: XCircle, label: "Inactive", className: "bg-gray-100 text-gray-500 border-gray-200" },
    }[status];

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="size-3" />
            {config.label}
        </span>
    );
};