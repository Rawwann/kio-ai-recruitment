"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, FolderOpen, LayoutDashboard, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/forms/input";
import { NotificationBell } from "@/components/features/dashboard/NotificationBell";
import { cn } from "@/lib/utils";
import { searchCompany, type CompanySearchResult } from "@/lib/api/companyService";

interface SearchResult {
    id: string;
    label: string;
    sub?: string;
    href: string;
}

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
            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
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
                        <p className="text-sm text-slate-800 dark:text-slate-100 leading-snug truncate">{r.label}</p>
                        {r.sub && <p className="text-xs text-slate-400 truncate">{r.sub}</p>}
                    </div>
                </button>
            ))}
        </section>
    );
}

function mapHits(rows: CompanySearchResult[]): SearchResult[] {
    return rows.map((r) => ({
        id: r.id,
        label: r.label,
        sub: r.sub,
        href: r.href,
    }));
}

export function TopHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlQuery = searchParams.get("q") ?? "";
    const [query, setQuery] = useState(urlQuery);
    const [debouncedQuery, setDebounced] = useState(urlQuery);
    const [isOpen, setIsOpen] = useState(urlQuery.length >= 1);
    const containerRef = useRef<HTMLDivElement>(null);

    const [campaigns, setCampaigns] = useState<SearchResult[]>([]);
    const [applicants, setApplicants] = useState<SearchResult[]>([]);
    const [projects, setProjects] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(query.trim()), 300);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        setIsOpen(debouncedQuery.length >= 1);
    }, [debouncedQuery]);

    useEffect(() => {
        if (debouncedQuery.length < 1) {
            setCampaigns([]);
            setApplicants([]);
            setProjects([]);
            return;
        }
        let cancelled = false;
        setSearchLoading(true);
        void (async () => {
            try {
                const res = await searchCompany(debouncedQuery);
                if (cancelled) return;
                setCampaigns(mapHits(res.campaigns ?? []));
                setApplicants(mapHits(res.applicants ?? []));
                setProjects(mapHits(res.projects ?? []));
            } catch {
                if (!cancelled) {
                    setCampaigns([]);
                    setApplicants([]);
                    setProjects([]);
                }
            } finally {
                if (!cancelled) setSearchLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery]);

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    const hasResults = campaigns.length + applicants.length + projects.length > 0;

    const handleItemClick = (href: string) => {
        setIsOpen(false);
        setQuery("");
        setDebounced("");
        router.push(href);
    };

    const submitSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        setDebounced(trimmed);
        setIsOpen(true);
        const params = new URLSearchParams(searchParams.toString());
        params.set("q", trimmed);
        router.push(`?${params.toString()}`, { scroll: false } as any);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") submitSearch();
        if (e.key === "Escape") {
            setIsOpen(false);
            setQuery("");
            setDebounced("");
        }
    };

    return (
        <header className="flex w-full items-center justify-between pb-4">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <LayoutDashboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div ref={containerRef} className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (debouncedQuery) setIsOpen(true);
                        }}
                        placeholder="Search campaigns, applicants, projects…"
                        className="pl-10 h-11 w-64 md:w-80 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 focus-visible:ring-purple-500 shadow-sm text-slate-900 dark:text-white"
                    />

                    {isOpen && (
                        <div
                            role="listbox"
                            aria-label="Search results"
                            className={cn(
                                "absolute right-0 top-[calc(100%+6px)] z-[9999] w-full",
                                "rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden",
                                "dark:border-slate-700 dark:bg-neutral-900",
                            )}
                        >
                            {searchLoading ? (
                                <div className="py-8 text-center text-sm text-slate-400">Searching…</div>
                            ) : hasResults ? (
                                <div className="max-h-80 overflow-y-auto pb-2">
                                    <ResultSection
                                        title="Campaigns"
                                        results={campaigns}
                                        icon={Briefcase}
                                        onItemClick={handleItemClick}
                                    />
                                    <ResultSection
                                        title="Applicants"
                                        results={applicants}
                                        icon={Users}
                                        onItemClick={handleItemClick}
                                    />
                                    <ResultSection
                                        title="Projects"
                                        results={projects}
                                        icon={FolderOpen}
                                        onItemClick={handleItemClick}
                                    />
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center justify-center gap-1">
                                    <Search className="size-7 text-slate-200 dark:text-slate-700" />
                                    <p className="text-sm text-slate-400">
                                        No results for &ldquo;{debouncedQuery}&rdquo;
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center w-11 h-11 bg-purple-200 text-purple-700 hover:bg-purple-300 dark:bg-purple-900/50 dark:text-purple-300 rounded-xl transition-colors shrink-0"
                    onClick={submitSearch}
                    aria-label="Submit search"
                >
                    <Search className="w-5 h-5" />
                </button>

                <NotificationBell className="ml-2" />
            </div>
        </header>
    );
}
