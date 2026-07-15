import { LayoutDashboard, FolderOpen, MessageSquare, User } from 'lucide-react';

export const candidateSidebarLinks = [
    { name: 'Dashboard', href: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/candidate/projects', icon: FolderOpen },
    { name: 'Messages', href: '/candidate/messages', icon: MessageSquare },
    { name: 'My Profile', href: '/candidate/profile', icon: User },
];