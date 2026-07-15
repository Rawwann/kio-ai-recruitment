"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, TriangleAlert, ArrowRight, Users } from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender
} from "@tanstack/react-table";

import { Card, CardContent } from "@/components/ui/layout/card";
import { Input } from "@/components/ui/forms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";
import { Button } from "@/components/ui/forms/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/data-display/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/navigation/pagination";
import NumberTicker from "@/components/vendors/magicui/number-ticker";
import { apiFetch } from "@/lib/api/apiClient";
import { toast } from "sonner";
import { PageShell } from "@/components/shared/PageShell";

// --- Types ---

type GlobalCandidate = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    skills: string[];
    /** Count of applications to the current company’s projects */
    applicationsCount: number;
    appliedProject: string;
    /** Raw individual project titles for filtering */
    appliedProjectTitles: string[];
    globalScore: number;
    status: "Passed" | "Failed" | "In Review" | "Flagged";
};

/** Normalize Django CandidateProfile list rows → talent-pool table (same idea as mapApplication for applications). */
function mapTalentProfileToGlobalCandidate(p: Record<string, unknown>): GlobalCandidate {
    const fromTop = p.topSkills;
    const fromSkills = p.skills;
    const rawSkillSource = fromTop != null ? fromTop : fromSkills;
    const skills = Array.isArray(rawSkillSource)
        ? (rawSkillSource as unknown[]).map((x) => String(x).trim()).filter(Boolean)
        : String(rawSkillSource ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    const skillsForTable = skills.length > 0 ? skills : ["No skills listed"];
    const raw =
        p.talentPoolDisplayScore != null
            ? p.talentPoolDisplayScore
            : p.performanceScore;
    const score = Math.round(Number(raw ?? 0));
    const clamped = Math.min(100, Math.max(0, score));
    // Use candidate User id only; profile id (p.id) is not the same and breaks /candidate-evaluation/{userId}/.
    const uid = String(p.userId ?? "");
    const applicationsCount = (() => {
        const n = Number(p.applicationsCount ?? 0);
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    })();
    const rawTitles: string[] = Array.isArray(p.appliedProjectTitles)
        ? (p.appliedProjectTitles as string[]).map(t => String(t).trim()).filter(Boolean)
        : String(p.appliedProjectTitles ?? "").split(",").map(t => t.trim()).filter(Boolean);
    const appliedProject =
        applicationsCount <= 0
            ? "0"
            : rawTitles.length
                ? `${applicationsCount} — ${rawTitles.join(", ")}`
                : String(applicationsCount);
    let status: GlobalCandidate["status"] = "In Review";
    if (clamped <= 0) status = "Flagged";
    else if (clamped >= 85) status = "Passed";
    else if (clamped < 45) status = "Failed";
    else if (clamped < 70) status = "In Review";
    else status = "Passed";

    return {
        id: uid,
        name: String(p.fullName ?? p.full_name ?? "—"),
        email: String(p.email ?? "—"),
        avatar: p.avatar_url ? String(p.avatar_url) : undefined,
        skills: skillsForTable,
        applicationsCount,
        appliedProject,
        appliedProjectTitles: rawTitles,
        globalScore: clamped,
        status,
    };
}

// Wrap Shadcn TableRow with Framer Motion for animations
const MotionTableRow = motion(TableRow);

export default function GlobalTalentPoolPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [candidates, setCandidates] = useState<GlobalCandidate[]>([]);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setListLoading(true);
                const raw = await apiFetch<unknown>("/api/users/candidates/");
                const arr = Array.isArray(raw) ? raw : (raw as { results?: unknown[] }).results ?? [];
                if (!cancelled) {
                    setCandidates((arr as Record<string, unknown>[]).map(mapTalentProfileToGlobalCandidate));
                }
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Failed to load candidates";
                if (!cancelled) {
                    toast.error(msg);
                    setCandidates([]);
                }
            } finally {
                if (!cancelled) setListLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const { totalPool, topPerformers, flaggedCount } = useMemo(() => {
        const totalPool = candidates.length;
        const topPerformers = candidates.filter((c) => c.globalScore > 90).length;
        const flaggedCount = candidates.filter((c) => c.status === "Flagged").length;
        return { totalPool, topPerformers, flaggedCount };
    }, [candidates]);

    // Dynamically extract unique project titles from candidates for the dropdown
    const uniqueProjectTitles = useMemo(() => {
        const titlesSet = new Set<string>();
        candidates.forEach((c) => {
            c.appliedProjectTitles.forEach((t) => titlesSet.add(t));
        });
        return Array.from(titlesSet).sort();
    }, [candidates]);

    // ── Filters State ─────────────────────────────────────────────────────────
    // Initialise globalFilter from the URL ?q= param so that arriving at
    // /company/candidates?q=rana immediately shows the filtered table.
    const [globalFilter, setGlobalFilter] = useState(searchParams.get("q") ?? "");
    const [skillFilter, setSkillFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");

    // ── Sync globalFilter → URL ───────────────────────────────────────────────
    // router.replace keeps the current history entry so the back button
    // still works correctly; scroll: false prevents the page jumping.
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (globalFilter) {
            params.set("q", globalFilter);
        } else {
            params.delete("q");
        }
        const newSearch = params.toString();
        const current = searchParams.toString();
        if (newSearch !== current) {
            router.replace(newSearch ? `?${newSearch}` : "?", { scroll: false } as any);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalFilter]);

    // Memoize the filtered data
    const filteredData = useMemo(() => {
        return candidates.filter(candidate => {
            const matchesSearch = candidate.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                candidate.email.toLowerCase().includes(globalFilter.toLowerCase());

            const matchesSkill = skillFilter === "all" || candidate.skills.some(skill => skill.toLowerCase() === skillFilter.toLowerCase());
            const matchesStatus = statusFilter === "all" || candidate.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesProject = projectFilter === "all" || candidate.appliedProjectTitles.some(t => t.toLowerCase() === projectFilter.toLowerCase());

            return matchesSearch && matchesSkill && matchesStatus && matchesProject;
        });
    }, [candidates, globalFilter, skillFilter, statusFilter, projectFilter]);

    // Table Columns Setup
    const columns = useMemo<ColumnDef<GlobalCandidate>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Candidate Profile",
                cell: ({ row }) => {
                    const candidate = row.original;
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800">
                                <AvatarImage className="" src={candidate.avatar || ""} alt={candidate.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold">
                                    {candidate.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{candidate.name}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{candidate.email}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "skills",
                header: "Top Skills",
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {row.original.skills.slice(0, 3).map((skill, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className={
                                    skill === "No skills listed"
                                        ? "bg-slate-50/80 text-slate-400 border-slate-200/80 dark:bg-slate-800/30 dark:text-slate-500 dark:border-slate-800 font-medium px-2 py-0 text-[10px] whitespace-nowrap"
                                        : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800 font-medium px-2 py-0 text-[10px] whitespace-nowrap"
                                }
                            >
                                {skill}
                            </Badge>
                        ))}
                        {row.original.skills.length > 3 && (
                            <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-800 font-medium px-1.5 py-0 text-[10px]">
                                +{row.original.skills.length - 3}
                            </Badge>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: "appliedProject",
                header: "Applied Project",
                cell: ({ row }) => <div className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-[180px] truncate">{row.getValue("appliedProject")}</div>,
            },
            {
                accessorKey: "globalScore",
                header: "Global AI Score",
                cell: ({ row }) => {
                    const score = row.getValue("globalScore") as number;
                    const isFlagged = row.original.status === "Flagged" || score === 0;

                    return (
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isFlagged ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`}>
                                {score}%
                            </span>
                            {isFlagged && (
                                <TriangleAlert className="h-4 w-4 text-red-500 fill-red-50 dark:fill-red-950" />
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    let dotColor = "bg-slate-500";
                    let badgeClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

                    if (status === "Passed") {
                        dotColor = "bg-emerald-500";
                        badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
                    } else if (status === "Failed") {
                        dotColor = "bg-red-500";
                        badgeClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900";
                    } else if (status === "In Review") {
                        dotColor = "bg-amber-500";
                        badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";
                    } else if (status === "Flagged") {
                        dotColor = "bg-rose-600";
                        badgeClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900";
                    }

                    return (
                        <Badge variant="outline" className={`font-medium gap-1.5 rounded-full px-2.5 py-0.5 ${badgeClass}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/company/candidates/${row.original.id}`)}
                                className="border-slate-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-slate-800 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 font-semibold text-xs h-8 px-3"
                            >
                                View Evaluation
                                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [router]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="w-full min-h-screen bg-transparent relative">
            <PageShell className="space-y-8 relative z-10" padding="default" width="default">

                {/* --- 1. Header & KPI Stats --- */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            Global Candidates
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            Manage and evaluate the complete talent pool across all your active projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Total Talent Pool Card */}
                        <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                            <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                                <Users className="h-32 w-32 text-purple-600" />
                            </div>
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                        Global
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                                        <NumberTicker value={listLoading ? 0 : totalPool} className="text-slate-900 tracking-tighter" />
                                    </p>
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Talent Pool</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Performers Card */}
                        <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                            <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                                <Search className="h-32 w-32 text-purple-600" />
                            </div>
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                                        <Search className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                        Top Tier
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-purple-600 tracking-tighter mb-1">
                                        <NumberTicker value={listLoading ? 0 : topPerformers} className="text-purple-600 tracking-tighter" />
                                    </p>
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Top Performers (&gt; 90%)</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Flagged / Cheating Risks Card */}
                        <Card className="border-red-100 bg-gradient-to-br from-red-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md shadow-sm">
                            <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                                <TriangleAlert className="h-32 w-32 text-red-500" />
                            </div>
                            <CardContent className="pt-6 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center shadow-sm">
                                        <TriangleAlert className="h-6 w-6 text-red-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                        Urgent
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-red-600 tracking-tighter mb-1">
                                        <NumberTicker value={listLoading ? 0 : flaggedCount} className="text-red-600 tracking-tighter" />
                                    </p>
                                    <p className="text-sm font-semibold text-red-600/80 uppercase tracking-wider">Flagged / Risks</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- 2. Advanced Filtering Row ---
                     Single flex row on all viewports.  12 px gap (gap-3) between every
                     element.  All inputs / triggers share the same h-9 (36 px) height.  */}
                <div className="bg-white dark:bg-slate-900/60 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

                    {/* Search — grows to fill remaining space */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <Input
                            placeholder="Search by candidate name or email..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9 h-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-none"
                        />
                    </div>

                    {/* Three filter dropdowns — fixed width, same height, 12 px apart */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        {/* Skills */}
                        <Select value={skillFilter} onValueChange={setSkillFilter}>
                            <SelectTrigger className="h-9 w-full sm:w-[152px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-medium">
                                <SelectValue placeholder="Skills" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                <SelectItem value="all">All Skills</SelectItem>
                                <SelectItem value="react">React</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="ui/ux">UI/UX</SelectItem>
                                <SelectItem value="node.js">Node.js</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9 w-full sm:w-[152px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-medium">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="in review">In Review</SelectItem>
                                <SelectItem value="flagged">Flagged</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Projects */}
                        <Select value={projectFilter} onValueChange={setProjectFilter}>
                            <SelectTrigger className="h-9 w-full sm:w-[152px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-medium">
                                <SelectValue placeholder="Project" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                <SelectItem value="all">All Projects</SelectItem>
                                {uniqueProjectTitles.map((title) => (
                                    <SelectItem key={title} value={title.toLowerCase()}>{title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* --- 3. Global Talent Table --- */}
                <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <Table className="">
                            <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="h-12 text-slate-500 dark:text-slate-400 font-semibold px-4 whitespace-nowrap">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="">
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row, index) => (
                                        <MotionTableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-default"
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="py-3 px-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </MotionTableRow>
                                    ))
                                ) : (
                                    <TableRow className="">
                                        <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500 font-medium">
                                            No candidates found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col items-center justify-center gap-3 border-t border-slate-100 dark:border-slate-800/50 p-4 bg-slate-50/30 dark:bg-transparent mt-auto sm:flex-row sm:justify-between">
                        <div className="text-center text-xs text-slate-500 font-medium sm:text-left">
                            Showing {table.getRowModel().rows.length} of {filteredData.length} total candidates
                        </div>

                        <Pagination className="w-auto mx-0">
                            <PaginationContent className="flex-wrap justify-center">
                                <PaginationItem className="">
                                    <PaginationPrevious
                                        href="#"
                                        size="sm"
                                        className={`border border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg mr-1 ${!table.getCanPreviousPage() ? "opacity-50 pointer-events-none" : ""}`}
                                        onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                                    />
                                </PaginationItem>
                                <PaginationItem className="">
                                    <PaginationLink href="#" size="sm" className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium" isActive={true}>
                                        {table.getState().pagination.pageIndex + 1}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem className="">
                                    <PaginationNext
                                        href="#"
                                        size="sm"
                                        className={`border border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg ml-1 ${!table.getCanNextPage() ? "opacity-50 pointer-events-none" : ""}`}
                                        onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>

            </PageShell>
        </div>
    );
}
