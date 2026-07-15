import { ShieldAlert, UserCheck, Cpu, AlertCircle, Play, LucideIcon } from "lucide-react";

export interface TimelineEvent {
    date: string;
    time: string;
    title: string;
    color: string;
    tagColor: string;
    bg: string;
    /** ISO date string (YYYY-MM-DD) — used by DashboardCalendar to place event dots */
    dateISO: string;
}

export interface SystemLog {
    id: number;
    title: string;
    desc: string;
    time: string;
    icon: LucideIcon;
    color: string;
    IconComponent: LucideIcon;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
    {
        date: "20 Apr",
        time: "Today - 05:00 PM",
        title: "Batch #3 Submission Ends",
        color: "border-indigo-500",
        tagColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
        bg: "bg-white",
        dateISO: "2026-04-20",
    },
    {
        date: "25 Apr",
        time: "Sat - 10:00 AM",
        title: "Final Shortlist Review",
        color: "border-purple-500",
        tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
        bg: "bg-white",
        dateISO: "2026-04-25",
    },
    {
        date: "3 May",
        time: "Sun - 09:00 AM",
        title: "New Challenge Launch: Python",
        color: "border-emerald-500",
        tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        bg: "bg-white",
        dateISO: "2026-05-03",
    },
];

export const SYSTEM_LOGS: SystemLog[] = [
    {
        id: 1,
        title: "New CV Parsed",
        desc: "Mostafa Nabil applied for Full Stack Developer.",
        time: "4:45 PM",
        icon: UserCheck,
        color: "text-emerald-600 bg-emerald-50",
        IconComponent: Play,
    },
    {
        id: 2,
        title: "AI Analysis Completed",
        desc: "Role-Fit Score generated for Batch #2 Candidates",
        time: "3:30 PM",
        icon: Cpu,
        color: "text-purple-600 bg-purple-50",
        IconComponent: Cpu,
    },
    {
        id: 3,
        title: "Cheating Flag Raised",
        desc: "Suspicious code pattern detected in Youssef's Submission",
        time: "12:00 PM",
        icon: ShieldAlert,
        color: "text-rose-600 bg-rose-50",
        IconComponent: ShieldAlert,
    },
    {
        id: 4,
        title: "Policy Updated",
        desc: "Admin updated the grading rubric for Python Track",
        time: "9:15 AM",
        icon: AlertCircle,
        color: "text-amber-600 bg-amber-50",
        IconComponent: AlertCircle,
    },
];