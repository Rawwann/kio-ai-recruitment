import {
    IconLayoutDashboard,
    IconBriefcase,
    IconUserScan,
    IconUserCircle,
    IconLogout,
} from "@tabler/icons-react";
import { SidebarLink as ISidebarLink } from "@/types";

// Only links whose page.tsx actually exists under src/app/(dashboard)/company/
export const TOP_SIDEBAR_LINKS: ISidebarLink[] = [
    {
        label: "Dashboard",
        href: "/company/dashboard",
        icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
        label: "Projects",
        href: "/company/projects",
        icon: <IconBriefcase className="h-5 w-5 shrink-0" />,
    },
    {
        label: "Candidates",
        href: "/company/candidates",
        icon: <IconUserScan className="h-5 w-5 shrink-0" />,
    },
    // "Messages" removed — /company/messages page does not exist
    {
        label: "Profile",
        href: "/company/profile",
        icon: <IconUserCircle className="h-5 w-5 shrink-0" />,
    },
];

// "Settings" removed — /company/settings page does not exist
export const BOTTOM_SIDEBAR_LINKS: ISidebarLink[] = [];

// Exported separately so Sidebar.tsx can render it as a signOut() button
export const LOGOUT_LINK = {
    label: "Log Out",
    icon: <IconLogout className="h-5 w-5 shrink-0" />,
};