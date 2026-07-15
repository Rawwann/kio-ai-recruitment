"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "motion/react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/navigation/sidebar";
import { useCompany } from "@/lib/contexts/CompanyContext";
import {
    TOP_SIDEBAR_LINKS,
    BOTTOM_SIDEBAR_LINKS,
    LOGOUT_LINK,
} from "@/lib/constants/company/sidebar-links";
import {
    CANDIDATE_TOP_SIDEBAR_LINKS,
    CANDIDATE_BOTTOM_SIDEBAR_LINKS,
    CANDIDATE_LOGOUT_LINK,
} from "@/lib/constants/candidate/sidebar-links";
import { CompanyAvatar } from "@/components/features/company/CompanyAvatar";
import { Logo, LogoIcon } from "@/components/layout/Logo";

// ── Candidate sidebar helpers ────────────────────────────────────────────────

/** Resolves the display name for a candidate from the NextAuth session. */
function candidateName(session: ReturnType<typeof useSession>["data"]): string {
    const cp = session?.user?.candidate_profile as Record<string, unknown> | null;
    return (
        (cp?.full_name as string | undefined) ||
        session?.user?.name ||
        session?.user?.email ||
        "My Profile"
    );
}

/** Returns up to two uppercase initials from a display name. */
function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? "?";
    return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

interface CandidateAvatarProps {
    session: ReturnType<typeof useSession>["data"];
    status:  ReturnType<typeof useSession>["status"];
}

const CandidateAvatar = memo(function CandidateAvatar({ session, status }: CandidateAvatarProps) {
    const cp       = session?.user?.candidate_profile as Record<string, unknown> | null;
    const photoUrl = cp?.avatar_url as string | undefined;
    const name     = candidateName(session);

    if (status === "loading") {
        return (
            <span className="h-9 w-9 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse inline-block" />
        );
    }

    if (photoUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={photoUrl}
                alt={name}
                className="h-9 w-9 shrink-0 rounded-full object-cover border-2 border-purple-200"
            />
        );
    }

    return (
        <span className="h-9 w-9 shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 text-sm font-semibold select-none">
            {initials(name)}
        </span>
    );
});

// ────────────────────────────────────────────────────────────────────────────

export function Sidebar1({ children }: { children: React.ReactNode }) {
    const { companyData } = useCompany();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isCandidate = pathname.startsWith("/candidate");

    const topLinks    = isCandidate ? CANDIDATE_TOP_SIDEBAR_LINKS    : TOP_SIDEBAR_LINKS;
    const bottomLinks = isCandidate ? CANDIDATE_BOTTOM_SIDEBAR_LINKS : BOTTOM_SIDEBAR_LINKS;
    const logoutLink  = isCandidate ? CANDIDATE_LOGOUT_LINK           : LOGOUT_LINK;

    // ── Company name resolution (4c) ────────────────────────────────────────
    // Priority: real auth session (Django company_profile.company_name)
    //           → CompanyContext (populated after profile fetch)
    //           → empty string
    const sessionCompanyName =
        ((session?.user?.company_profile as Record<string, unknown> | null)
            ?.company_name as string | undefined) ?? "";
    const companyName   = sessionCompanyName || companyData.name || "";
    const isNameLoading = !isCandidate && status === "loading";

    return (
        <div className="flex flex-col md:flex-row bg-transparent dark:bg-neutral-800 w-screen h-dvh overflow-hidden">
            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-10">

                    {/* ── Top section: Logo + nav links (scrollable) ────── */}
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {topLinks.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>

                    {/* ── Bottom section: always pinned inside sidebar (4b) ─
                         shrink-0 stops flex from squeezing this section when
                         the top section is tall.  justify-between on the
                         parent SidebarBody pushes it to the bottom edge.    */}
                    <div className="flex flex-col gap-2 shrink-0">
                        {/* Secondary nav links (currently empty for both roles
                            after removing non-existent Settings pages)        */}
                        {bottomLinks.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))}

                        {/* Log Out — label uses the same motion.span pattern as
                            SidebarLink so it fades/hides when the sidebar
                            collapses, preventing text overflow (4b).           */}
                        <button
                            type="button"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors w-full text-left"
                        >
                            {logoutLink.icon}
                            <motion.span
                                animate={{
                                    display: open ? "inline-block" : "none",
                                    opacity: open ? 1 : 0,
                                }}
                                className="text-neutral-700 dark:text-neutral-200 text-sm whitespace-pre !p-0 !m-0"
                            >
                                {logoutLink.label}
                            </motion.span>
                        </button>

                        {/* Company profile link — only for company role. */}
                        {!isCandidate && (
                            <Link
                                href="/company/profile"
                                prefetch={true}
                                className="flex items-center gap-2 group/sidebar py-2"
                            >
                                <CompanyAvatar />
                                <motion.span
                                    animate={{
                                        display: open ? "inline-block" : "none",
                                        opacity: open ? 1 : 0,
                                    }}
                                    className="text-sm whitespace-pre !p-0 !m-0 max-w-[160px] overflow-hidden"
                                >
                                    {isNameLoading ? (
                                        <span className="inline-block h-3.5 w-[120px] rounded bg-neutral-300 dark:bg-neutral-600 animate-pulse" />
                                    ) : (
                                        <span className="text-neutral-700 dark:text-neutral-200 truncate block group-hover/sidebar:translate-x-1 transition duration-150">
                                            {companyName || "Company Profile"}
                                        </span>
                                    )}
                                </motion.span>
                            </Link>
                        )}

                        {/* Candidate user card — only for candidate role. */}
                        {isCandidate && (
                            <Link
                                href="/candidate/profile"
                                prefetch={true}
                                className="flex items-center gap-2 group/sidebar py-2"
                            >
                                <CandidateAvatar
                                    session={session}
                                    status={status}
                                />
                                <motion.span
                                    animate={{
                                        display: open ? "inline-block" : "none",
                                        opacity: open ? 1 : 0,
                                    }}
                                    className="text-sm !p-0 !m-0 max-w-[140px] overflow-hidden"
                                >
                                    {status === "loading" ? (
                                        <span className="inline-block h-3.5 w-[120px] rounded bg-neutral-300 dark:bg-neutral-600 animate-pulse" />
                                    ) : (
                                        <span className="flex flex-col group-hover/sidebar:translate-x-1 transition duration-150">
                                            <span className="text-neutral-700 dark:text-neutral-200 font-medium truncate leading-tight">
                                                {candidateName(session)}
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">
                                                Candidate
                                            </span>
                                        </span>
                                    )}
                                </motion.span>
                            </Link>
                        )}
                    </div>

                </SidebarBody>
            </Sidebar>

            <div className="flex flex-1 overflow-y-auto bg-transparent">
                {children}
            </div>
        </div>
    );
}
