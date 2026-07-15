import { Badge } from "@/components/ui/data-display/badge";

type CandidateStatus = "Passed" | "Failed" | "In Review" | "Flagged";

interface CandidateStatusBadgeProps {
    status: CandidateStatus;
}

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
    let dotColor = "bg-slate-500";
    let badgeClass =
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

    if (status === "Passed") {
        dotColor = "bg-emerald-500";
        badgeClass =
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
    } else if (status === "Failed") {
        dotColor = "bg-red-500";
        badgeClass =
            "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900";
    } else if (status === "In Review") {
        dotColor = "bg-amber-500";
        badgeClass =
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";
    } else if (status === "Flagged") {
        dotColor = "bg-rose-600";
        badgeClass =
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900";
    }

    return (
        <Badge variant="outline" className={`font-medium gap-1.5 rounded-full px-2.5 py-0.5 ${badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {status}
        </Badge>
    );
}