"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Copy,
    Edit2,
    ExternalLink,
    Trash2,
    Plus,
    MoreHorizontal
} from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { MiniChart } from "@/components/features/projects/MiniChart";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProject } from "@/lib/contexts/ProjectContext";

import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { Card, CardContent } from "@/components/ui/layout/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar";
import { Badge } from "@/components/ui/data-display/badge";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/overlays/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/data-display/table";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/navigation/pagination";
import { NumberTicker } from "@/components/vendors/magicui/number-ticker";
import { apiFetch } from "@/lib/api/apiClient";
import { updateApplicationStatus } from "@/lib/api/companyService";
import { formatDistanceToNow } from "date-fns";
import type { Applicant } from "@/types/common";

/** Map UI status → Django `ProjectApplication.status` */
function mapUiStatusToDjango(s: Applicant["status"]): "PENDING" | "TECHNICAL_REVIEW" | "PASSED" | "HIRED" | "NOT_SELECTED" {
    if (s === "Passed") return "PASSED";
    if (s === "Failed") return "NOT_SELECTED";
    if (s === "Flagged") return "TECHNICAL_REVIEW";
    return "TECHNICAL_REVIEW";
}

/** Map Django ProjectApplication rows → company applicants table (parallel to candidate mapApplication). */
function mapProjectApplicationToApplicant(a: Record<string, unknown>): Applicant {
    const st = String(a.status ?? "").toUpperCase();
    let status: Applicant["status"] = "In Review";
    if (st === "PASSED" || st === "HIRED") status = "Passed";
    if (st === "NOT_SELECTED" || st === "CANCELLED") status = "Failed";
    if (st === "FLAGGED") status = "Flagged";

    const submitted = a.applied_at ? new Date(String(a.applied_at)) : null;
    const submissionDate =
        submitted && !Number.isNaN(submitted.getTime())
            ? submitted.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "—";

    const scoreRaw = a.role_fit_score;
    const aiScore = scoreRaw != null && scoreRaw !== "" ? Number(scoreRaw) : null;

    const rawRepo = a.repo_url ?? a.github_repo_url;
    const repoUrl =
        rawRepo != null && String(rawRepo).trim() !== "" ? String(rawRepo).trim() : undefined;

    return {
        id: String(a.id),
        candidateUserId: a.candidate != null ? String(a.candidate) : undefined,
        repoUrl,
        name: String(a.candidate_name ?? "—"),
        email: String(a.candidate_email ?? "—"),
        submissionDate,
        aiScore: Number.isFinite(aiScore as number) ? (aiScore as number) : null,
        status,
    };
}

// --- Page Component ---

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { projects, updateProject } = useProject();
    const project = projects.find((p: { id: string }) => p.id === (params?.id as string));

    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Applicant | null>(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState<Applicant["status"]>("In Review");
    const [editScore, setEditScore] = useState<number | "">("");
    const [editRepoUrl, setEditRepoUrl] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);

    const handleSaveEdit = () => {
        if (!editingCandidate) return;
        const appId = Number.parseInt(editingCandidate.id, 10);
        if (Number.isNaN(appId)) {
            toast.error("Invalid application id.");
            return;
        }

        void (async () => {
            setSavingEdit(true);
            try {
                const repoTrim = editRepoUrl.trim();
                await updateApplicationStatus(appId, {
                    status: mapUiStatusToDjango(editStatus),
                    role_fit_score: editScore === "" ? 0 : Number(editScore),
                    repo_url: repoTrim.length ? repoTrim : null,
                });

                const newCandidates = candidates.map((c) => {
                    if (c.id === editingCandidate.id) {
                        return {
                            ...c,
                            name: editName,
                            status: editStatus,
                            aiScore: editScore === "" ? null : Number(editScore),
                            repoUrl: repoTrim.length ? repoTrim : undefined,
                        };
                    }
                    return c;
                });
                setCandidates(newCandidates);
                if (project) {
                    updateProject(project.id, { applicantsList: newCandidates });
                }
                setIsEditModalOpen(false);
                toast.success("Candidate details updated successfully");
            } catch (e) {
                const msg = e instanceof Error ? e.message : "Update failed";
                toast.error(msg);
            } finally {
                setSavingEdit(false);
            }
        })();
    };

    // Debounce the search input to prevent firing filters too quickly
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(globalFilter);
        }, 300);
        return () => clearTimeout(handler);
    }, [globalFilter]);

    const [candidates, setCandidates] = useState<Applicant[]>(project?.applicantsList ?? []);

    useEffect(() => {
        const pid = params?.id as string | undefined;
        if (!pid) return;
        let cancelled = false;
        (async () => {
            try {
                const raw = await apiFetch<unknown>(`/api/projects/${pid}/applicants/`);
                const arr = Array.isArray(raw) ? raw : (raw as { results?: unknown[] }).results ?? [];
                const mapped = (arr as Record<string, unknown>[]).map(mapProjectApplicationToApplicant);
                if (cancelled) return;
                setCandidates(mapped);
                updateProject(pid, { applicantsList: mapped });
            } catch {
                if (!cancelled) {
                    toast.error("Could not load applicants for this project.");
                    setCandidates([]);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
        // Intentionally omit updateProject from deps — it is not stable in ProjectContext.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    // Filter Logic - Memoized
    const filteredCandidates = useMemo(() => {
        return candidates.filter(candidate => {
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "passed" && candidate.status === "Passed") ||
                (statusFilter === "failed" && candidate.status === "Failed") ||
                (statusFilter === "review" && candidate.status === "In Review");

            const q = debouncedSearch.toLowerCase();
            const matchesSearch =
                candidate.name.toLowerCase().includes(q) ||
                candidate.email.toLowerCase().includes(q) ||
                (candidate.repoUrl?.toLowerCase().includes(q) ?? false);

            return matchesStatus && matchesSearch;
        });
    }, [candidates, statusFilter, debouncedSearch]);

    // Dynamic KPIs Memoized
    const { totalApplicants, needsReviewCount, averageScore, dynamicChartData } = useMemo(() => {
        const total = filteredCandidates.length;
        const needsReview = filteredCandidates.filter(c => c.status === "In Review").length;

        const scored = filteredCandidates.filter(c => c.aiScore !== null);
        const avg = scored.length > 0
            ? Math.round(scored.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) / scored.length)
            : 0;

        const chartData = scored.slice(0, 6).map(c => ({ value: c.aiScore || 0 }));

        return {
            totalApplicants: total,
            needsReviewCount: needsReview,
            averageScore: avg,
            dynamicChartData: chartData
        };
    }, [filteredCandidates]);

    // Setup TanStack Table columns - Memoized
    const columns = useMemo<ColumnDef<Applicant>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="border-slate-300 dark:border-slate-700"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="border-slate-300 dark:border-slate-700"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Candidate Name",
            cell: ({ row }) => {
                const applicant = row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-800">
                            <AvatarImage className="" src={applicant.avatar || ""} alt={applicant.name} />
                            <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-medium">
                                {applicant.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{applicant.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{applicant.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "submissionDate",
            header: "Submission Date",
            cell: ({ row }) => <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{row.getValue("submissionDate")}</div>,
        },
        {
            id: "repository",
            header: "Repository",
            cell: ({ row }) => {
                const u = (row.original as Applicant).repoUrl;
                if (!u) {
                    return <span className="text-sm text-slate-400">—</span>;
                }
                return (
                    <a
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-[200px] items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 truncate"
                    >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{u.replace(/^https?:\/\//, "")}</span>
                    </a>
                );
            },
        },
        {
            accessorKey: "aiScore",
            header: "AI Score",
            cell: ({ row }) => {
                const score = row.getValue("aiScore") as number | null;
                if (score === null) {
                    return <div className="text-sm text-slate-500 dark:text-slate-400">Processing...</div>;
                }
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{score}%</span>
                        {score === 0 && (
                            <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 px-1 py-0.5 rounded">
                                (Flagged)
                            </span>
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
                    <div className="flex items-center justify-end gap-1">
                        {row.original.candidateUserId && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/company/candidates/${row.original.candidateUserId}`)}
                                className="border-slate-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-slate-800 dark:text-purple-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 font-semibold text-xs h-8 px-3 mr-2"
                            >
                                View Evaluation
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                navigator.clipboard.writeText(`https://kio.com/candidates/${row.original.id}`);
                                toast.success("Link copied to clipboard");
                            }}
                            className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setEditingCandidate(row.original);
                                setEditName(row.original.name);
                                setEditStatus(row.original.status);
                                setEditScore(row.original.aiScore ?? "");
                                setEditRepoUrl((row.original as Applicant).repoUrl ?? "");
                                setIsEditModalOpen(true);
                            }}
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setCandidates(prev => prev.filter(c => c.id !== row.original.id));
                                toast.success("Candidate removed");
                            }}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ], [setCandidates]);

    const table = useReactTable({
        data: filteredCandidates,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    // Stagger container animation
    const containerVariants: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    return (
        <div className="w-full min-h-screen bg-transparent dark:bg-transparent relative overflow-hidden flex flex-col p-6 md:p-8 space-y-8">

            {/* --- 1. Header Area --- */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <Breadcrumb className="">
                    <BreadcrumbList className="">
                        <BreadcrumbItem className="">
                            <BreadcrumbLink className="" asChild>
                                <Link href="/company/projects" prefetch={true} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                                    <ChevronLeft className="h-4 w-4" />
                                    Projects
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="">
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem className="">
                            <BreadcrumbPage className="font-semibold text-slate-900 dark:text-slate-100">
                                {project?.title || "E-commerce React App"}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search globally..."
                            className="pl-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-purple-500 rounded-lg shadow-sm"
                        />
                    </div>
                    <Button size="icon" className="h-10 w-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm shrink-0">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* --- 2. KPI Stats Cards --- */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
                <motion.div variants={itemVariants}>
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-5 flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold tracking-tight text-purple-700 dark:text-purple-400">
                                    <NumberTicker value={totalApplicants} className="text-purple-700 dark:text-purple-400" />
                                </p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applicants</p>
                            </div>
                            <MiniChart fill="var(--primary)" data={dynamicChartData} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-5 flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold tracking-tight text-amber-500 dark:text-amber-400">
                                    <NumberTicker value={needsReviewCount} className="text-amber-500 dark:text-amber-400" />
                                </p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Needs Review</p>
                            </div>
                            <MiniChart fill="var(--chart-3)" data={dynamicChartData} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-5 flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold tracking-tight text-rose-500 dark:text-rose-400 flex items-center">
                                    <NumberTicker value={averageScore} className="text-rose-500 dark:text-rose-400" />%
                                </p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Score</p>
                            </div>
                            <MiniChart fill="var(--chart-4)" data={dynamicChartData} />
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <CardContent className="p-5 flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold tracking-tight text-sky-500 dark:text-sky-400">
                                    <NumberTicker value={project?.daysLeft || 5} className="text-sky-500 dark:text-sky-400" />
                                </p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Days Left</p>
                            </div>
                            <MiniChart fill="var(--chart-2)" data={dynamicChartData} />
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* --- 3. Table Controls --- */}
            <div className="pt-4 flex flex-col space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Applicants Table</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                    <Button
                        onClick={() => router.push(`/company/projects/edit/${project?.id || '123'}`)}
                        className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm font-medium shrink-0"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Edit Project Settings
                    </Button>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search candidate name..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="pl-9 h-10 w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium">
                                <SelectValue className="" placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="all" className="">All Statuses</SelectItem>
                                <SelectItem value="passed" className="">Passed</SelectItem>
                                <SelectItem value="failed" className="">Failed</SelectItem>
                                <SelectItem value="review" className="">In Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* --- 4. The Data Table --- */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <Table className="">
                        <TableHeader className="">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="text-xs tracking-wider uppercase font-semibold text-slate-500 py-3 h-12">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="">
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                                        No applicants found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- 5. Footer Pagination --- */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 p-4 bg-slate-50/30 dark:bg-transparent mt-auto">
                    <div className="flex items-center gap-2">
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[130px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium">
                                <SelectValue className="" placeholder="10 rows per page" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="10" className="">10 List per Page</SelectItem>
                                <SelectItem value="20" className="">20 List per Page</SelectItem>
                                <SelectItem value="50" className="">50 List per Page</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-xs text-slate-500">
                            Showing {table.getRowModel().rows.length} of {filteredCandidates.length} records
                        </span>
                    </div>

                    <Pagination className="w-auto mx-0">
                        <PaginationContent className="">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    size="sm"
                                    className={`border border-slate-200 dark:border-slate-800 h-8 px-3 rounded-lg mr-1 ${!table.getCanPreviousPage() ? "opacity-50 pointer-events-none" : ""}`}
                                    onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" size="sm" className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium" isActive={true}>
                                    {table.getState().pagination.pageIndex + 1}
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
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

            {/* Bottom Footer Credits */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                    <span>Copyright © 2026 KIO</span>
                    <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Terms and conditions</Link>
                    <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Contact</Link>
                </div>
            </div>

            {/* Edit Candidate Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="">
                        <DialogTitle className="">Edit Candidate</DialogTitle>
                        <DialogDescription className="">
                            Update the candidate's details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Name
                            </label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Status
                            </label>
                            <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select status" className="" />
                                </SelectTrigger>
                                <SelectContent className="">
                                    <SelectItem value="Passed" className="">Passed</SelectItem>
                                    <SelectItem value="Failed" className="">Failed</SelectItem>
                                    <SelectItem value="In Review" className="">In Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                AI Score (0-100)
                            </label>
                            <Input
                                type="number"
                                value={editScore}
                                onChange={e => setEditScore(e.target.value ? Number(e.target.value) : "")}
                                min={0}
                                max={100}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                GitHub / submission repository URL
                            </label>
                            <Input
                                type="url"
                                placeholder="https://github.com/org/repo"
                                value={editRepoUrl}
                                onChange={(e) => setEditRepoUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="" disabled={savingEdit}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            className="kio-btn-ai-primary"
                            disabled={savingEdit}
                        >
                            {savingEdit ? "Saving…" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
