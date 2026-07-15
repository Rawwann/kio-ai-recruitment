"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Search, Users } from "lucide-react";
import { useCompany } from "@/lib/contexts/CompanyContext";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
    id: string;
    label: string;
    sub?: string;
    href: string;
}

// ─── ResultSection ────────────────────────────────────────────────────────────

function ResultSection({
    title,
    results,
    icon: Icon,
    onItemClick,
}: {
    title: string;
    results: SearchResult[];
    icon: React.ElementType;
    onItemClick: (href: string) => void;
}) {
    if (results.length === 0) return null;
    return (
        <section>
            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {title}
            </p>
            {results.map((r) => (
                <button
                    key={r.id}
                    type="button"
                    onClick={() => onItemClick(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <Icon className="size-4 text-purple-500 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{r.label}</p>
                        {r.sub && (
                            <p className="text-xs text-gray-400 truncate">{r.sub}</p>
                        )}
                    </div>
                </button>
            ))}
        </section>
    );
}

// ─── MagicSearchBar ───────────────────────────────────────────────────────────

export function MagicSearchBar() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const { companyData } = useCompany();

    // ── State ─────────────────────────────────────────────────────────────────
    // Initialise from ?q= so a deep-linked URL immediately shows results.
    const [query,   setQuery]   = useState(searchParams.get("q") ?? "");
    const [focused, setFocused] = useState(false);

    // ── The dropdown IS visible whenever there is a non-empty query ───────────
    // Driving visibility directly from query (not from a debounced copy) means
    // the dropdown appears on the very first keystroke — no timer lag.
    const isOpen = query.length > 0;

    // ── Outside-click → close ─────────────────────────────────────────────────
    // The ref is placed on the motion.div so that both the input and the
    // absolutely-positioned dropdown are inside the same boundary.
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Client-side filtering ─────────────────────────────────────────────────
    // TODO: replace with real API calls when backend endpoints are ready
    //   Team members  → GET /api/users/team/?search=<q>
    //   Billing       → (backend TBD, e.g. Stripe/subscription history)
    const q = query.toLowerCase();

    const memberResults = useMemo<SearchResult[]>(
        () =>
            (companyData.team ?? [])
                .filter(
                    (m) =>
                        m.name.toLowerCase().includes(q) ||
                        m.email.toLowerCase().includes(q) ||
                        m.role.toLowerCase().includes(q),
                )
                .map((m) => ({
                    id:    m.id,
                    label: m.name,
                    sub:   `${m.role} · ${m.email}`,
                    href:  "/company/profile?tab=team",
                })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [companyData.team, q],
    );

    const billingResults = useMemo<SearchResult[]>(
        () =>
            (companyData.billing?.history ?? [])
                .filter((h) => h.description.toLowerCase().includes(q))
                .map((h) => ({
                    id:    h.id,
                    label: h.description,
                    sub:   `$${h.amount} · ${h.date}`,
                    href:  "/company/profile?tab=billing",
                })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [companyData.billing?.history, q],
    );

    const hasResults = memberResults.length + billingResults.length > 0;

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleItemClick = (href: string) => {
        setQuery("");
        router.push(href);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") setQuery("");
    };

    return (
        /*
         * The motion.div is both the animated-width container AND the ref
         * boundary for outside-click detection.  The dropdown sits INSIDE
         * this element so it always inherits the correct animated width via
         * w-full — solving the previous "0-width / invisible" bug that
         * occurred when the dropdown was a sibling of the motion.div.
         */
        <motion.div
            ref={containerRef}
            animate={{ width: focused ? 260 : 200 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex items-center"
            style={{ overflow: "visible" }}
        >
            {/* ── Input ───────────────────────────────────────────────── */}
            <Search className="absolute left-3 size-4 text-gray-400 pointer-events-none z-10" />
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search team, billing…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />

            {/* ── Dropdown ────────────────────────────────────────────── */}
            {/*
             * Placed inside motion.div so w-full = the animated width.
             * max-h-[300px] + overflow-y-auto satisfies the spec requirement.
             */}
            {isOpen && (
                <div
                    role="listbox"
                    aria-label="Search results"
                    className={cn(
                        // Position flush with the input's left edge; width matches exactly.
                        // z-[9999] ensures the dropdown clears the sidebar and any nested
                        // stacking contexts created by the overflow-y-auto scroll containers.
                        "absolute left-0 top-[calc(100%+6px)] z-[9999] w-full",
                        "max-h-[300px] overflow-y-auto",
                        "rounded-xl border border-gray-200 bg-white shadow-xl",
                        "dark:border-slate-700 dark:bg-neutral-900",
                    )}
                >
                    {hasResults ? (
                        <div className="pb-2">
                            <ResultSection
                                title="Team Members"
                                results={memberResults}
                                icon={Users}
                                onItemClick={handleItemClick}
                            />
                            <ResultSection
                                title="Billing History"
                                results={billingResults}
                                icon={CreditCard}
                                onItemClick={handleItemClick}
                            />
                        </div>
                    ) : (
                        <div className="py-6 text-center">
                            <p className="text-sm text-gray-400">No results found</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
