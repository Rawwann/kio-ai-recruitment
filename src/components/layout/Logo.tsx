"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function dashboardHomeHref(pathname: string | null) {
    if (pathname?.startsWith("/candidate")) return "/candidate/dashboard";
    return "/company/dashboard";
}

export const Logo = () => {
    const pathname = usePathname();
    const href = dashboardHomeHref(pathname);

    return (
        <Link
            href={href}
            prefetch={true}
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <img
                src="/logo.svg"
                alt="logo"
                className="h-6 w-6 shrink-0 object-contain"
            />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-lg whitespace-pre text-purple-950 dark:text-white"
            >
                KIO
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    const pathname = usePathname();
    const href = dashboardHomeHref(pathname);

    return (
        <Link
            href={href}
            prefetch={true}
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <img src="/logo.svg" alt="logo" className="h-6 w-6" />
        </Link>
    );
};