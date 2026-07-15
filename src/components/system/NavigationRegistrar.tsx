"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerNavPush, unregisterNavPush } from "@/lib/navigation-bridge";

/**
 * Registers Next.js router.push for use from apiClient (401 handling).
 */
export function NavigationRegistrar() {
    const router = useRouter();

    useEffect(() => {
        const push = (href: string) => {
            router.push(href);
        };
        registerNavPush(push);
        return () => unregisterNavPush(push);
    }, [router]);

    return null;
}
