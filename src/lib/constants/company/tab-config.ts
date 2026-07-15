import { TabKey } from "@/types";

export const TABS: readonly TabKey[] = ["general", "team", "billing", "security", "notifications"] as const;

export const TAB_LABELS: Record<TabKey, string> = {
    general: "General Info",
    team: "Team Members",
    billing: "Billing",
    notifications: "Notifications",
    security: "Security",
};