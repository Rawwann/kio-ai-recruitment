import {
    IconLayoutDashboard,
    IconBriefcase,
    IconClipboardList,
    IconUserCircle,
    IconLogout,
} from "@tabler/icons-react";
import { SidebarLink as ISidebarLink } from "@/types";

export const CANDIDATE_TOP_SIDEBAR_LINKS: ISidebarLink[] = [
    {
        label: "Dashboard",
        href: "/candidate/dashboard",
        icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" />,
    },
    {
        label: "All Projects",
        href: "/candidate/projects",
        icon: <IconBriefcase className="h-5 w-5 shrink-0" />,
    },
    {
        label: "My Applications",
        href: "/candidate/applications",
        icon: <IconClipboardList className="h-5 w-5 shrink-0" />,
    },
    {
        label: "My Profile",
        href: "/candidate/profile",
        icon: <IconUserCircle className="h-5 w-5 shrink-0" />,
    },
];

// "Settings" removed — /candidate/settings page does not exist
export const CANDIDATE_BOTTOM_SIDEBAR_LINKS: ISidebarLink[] = [];

export const CANDIDATE_LOGOUT_LINK = {
    label: "Log Out",
    icon: <IconLogout className="h-5 w-5 shrink-0" />,
};
