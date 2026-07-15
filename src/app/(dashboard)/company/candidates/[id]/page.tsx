"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ChevronRight,
    Download,
    X,
    ShieldCheck,
    TriangleAlert,
    CheckCircle2,
    Info,
    GitCommitHorizontal,
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/navigation/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/data-display/avatar";
import { Button } from "@/components/ui/forms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { Badge } from "@/components/ui/data-display/badge";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import NumberTicker from "@/components/vendors/magicui/number-ticker";
import ShimmerButton from "@/components/vendors/magicui/shimmer-button";

// Hook
import { useCandidateEvaluation } from "@/hooks/candidates/useCandidateEvaluation";

// Shared
import { containerVariants, itemVariants } from "@/lib/constants/auth/animation-variants";

// ──────────────────────────────────────────────────────────────────
// CandidateEvaluationPage — layout shell only
// All logic lives in useCandidateEvaluation.
// ──────────────────────────────────────────────────────────────────
export default function CandidateEvaluationPage() {
    const {
        candidate,
        loading: evalLoading,
        localStatus,
        handleAdvance,
        handleReject,
    } = useCandidateEvaluation();

    if (evalLoading) {
        return (
            <div className="w-full min-h-screen bg-transparent relative">
                <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 relative z-10">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="w-full min-h-screen bg-transparent relative">
                <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
                    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                            <Info className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                No Evaluation Data Available
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                This candidate hasn&apos;t submitted an application to any of your projects yet,
                                or the AI evaluation is still being processed.
                            </p>
                        </div>
                        <Link href="/company/candidates" prefetch={true}>
                            <Button variant="outline" className="mt-2">
                                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                                Back to All Candidates
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (candidate.evaluationError) {
        return (
            <div className="w-full min-h-screen bg-transparent relative">
                <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
                    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
                            <TriangleAlert className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                                Evaluation unavailable — API key not configured
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                The Groq API key is missing. Please configure your GROQ_API_KEY environment variable.
                            </p>
                        </div>
                        <Link href="/company/candidates" prefetch={true}>
                            <Button variant="outline" className="mt-2 border-red-200 text-red-600 hover:bg-red-50">
                                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                                Back to All Candidates
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-transparent relative">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 relative z-10">

                {/* --- 1. Top Section --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col space-y-6"
                >
                    <Breadcrumb className="">
                        <BreadcrumbList className="">
                            <BreadcrumbItem className="">
                                <BreadcrumbLink className="" asChild>
                                    <Link href="/company/candidates" prefetch={true} className="text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
                                        All Candidates
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="">
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem className="">
                                <BreadcrumbPage className="font-semibold text-slate-900 dark:text-slate-100">
                                    {candidate.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-5">
                            <Avatar className="h-20 w-20 border-2 border-white dark:border-slate-900 shadow-md">
                                <AvatarImage className="" src={candidate.avatar || ""} alt={candidate.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-2xl font-bold">
                                    {candidate.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {candidate.name}
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium">
                                    <span className="text-slate-500 dark:text-slate-400">{candidate.email}</span>
                                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                                    <Badge variant="secondary" className="w-fit bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30">
                                        {candidate.role || "Applicant"}
                                    </Badge>
                                    <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                                    <Badge
                                        variant="outline"
                                        className={
                                            localStatus === 'Passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' :
                                                localStatus === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900' :
                                                    localStatus === 'Flagged' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900' :
                                                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900'
                                        }
                                    >
                                        {localStatus || candidate.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <a
                                href={candidate.cvUrl ?? undefined}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className={!candidate.cvUrl ? "pointer-events-none opacity-50" : ""}
                                aria-disabled={!candidate.cvUrl}
                            >
                                <Button variant="outline" className="flex-1 md:flex-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download CV
                                </Button>
                            </a>
                            <Button
                                variant="ghost"
                                onClick={handleReject}
                                disabled={localStatus === 'Failed'}
                                className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="mr-2 h-4 w-4" />
                                {localStatus === 'Failed' ? 'Rejected' : 'Reject'}
                            </Button>
                            <div className="flex-1 md:flex-none">
                                <ShimmerButton
                                    onClick={handleAdvance}
                                    className={localStatus === 'Passed' ? 'opacity-50 cursor-not-allowed' : ''}
                                    disabled={localStatus === 'Passed'}
                                >
                                    <span className="whitespace-pre-wrap text-center text-sm font-bold leading-none tracking-tight text-white">
                                        {localStatus === 'Passed' ? 'Advanced' : 'Advance Candidate'}
                                    </span>
                                </ShimmerButton>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- Main Content Grid --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-6"
                >
                    {/* --- 2. Scorecard & Risk Assessment --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Scorecard (2/3) */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <Card className="h-full border-slate-300 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900/60 relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Radar className="h-48 w-48 text-purple-600" />
                                </div>
                                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 h-full relative z-10">
                                    <div className="flex flex-col items-center justify-center space-y-2 text-center md:text-left md:items-start min-w-[200px]">
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Final Match Score</p>
                                        <div className="flex items-baseline gap-1">
                                            {candidate.aiScore ? (
                                                <>
                                                    <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                        <NumberTicker value={candidate.aiScore} className="text-slate-900 dark:text-white" />
                                                    </span>
                                                    <span className="text-3xl font-bold text-slate-400 dark:text-slate-500">%</span>
                                                </>
                                            ) : (
                                                <span className="text-5xl font-black text-slate-400 dark:text-slate-500 tracking-tighter">N/A</span>
                                            )}
                                        </div>
                                        {/* BUG-03: Strictly conditional badge — no badge for scores < 60 or null */}
                                        {(candidate.aiScore ?? 0) >= 80 ? (
                                            <Badge variant="outline" className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900">
                                                Strong Fit
                                            </Badge>
                                        ) : (candidate.aiScore ?? 0) >= 60 ? (
                                            <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900">
                                                Good Match
                                            </Badge>
                                        ) : null}
                                    </div>

                                    <div className="w-full h-[250px] md:h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={candidate.radarData || []}>
                                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-700" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} className="dark:tick-slate-400" />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar
                                                    name="Candidate"
                                                    dataKey="A"
                                                    stroke="#9333ea"
                                                    fill="#a855f7"
                                                    fillOpacity={0.3}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                                                    itemStyle={{ color: '#9333ea', fontWeight: 700 }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Risk Assessment (1/3) */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <Card className={`h-full shadow-sm overflow-hidden ${(candidate.risk?.isSafe ?? true) ? 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10' : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10'}`}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            {(candidate.risk?.isSafe ?? true) ? (
                                                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <TriangleAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                            )}
                                            Integrity Check
                                        </CardTitle>
                                        <Badge variant="outline" className={`${(candidate.risk?.isSafe ?? true) ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800'}`}>
                                            Trust: {candidate.risk?.trustScore ?? 100}%
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(candidate.risk?.logs || []).map(
                                            (log: { id: string | number; isWarning: boolean; action: string; time: string }) => (
                                                <div key={log.id} className="flex items-start gap-3">
                                                    <div className="mt-1 flex-shrink-0">
                                                        {log.isWarning ? (
                                                            <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                                        ) : (
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-medium ${log.isWarning ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {log.action}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                                            {log.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* --- 3. Insights --- */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-0 overflow-hidden border-emerald-400 dark:border-emerald-900/30 shadow-sm bg-white dark:bg-slate-900">
                            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-400 dark:border-emerald-900/30 px-6 pt-6 pb-2">
                                <CardTitle className="text-emerald-800 dark:text-emerald-400 flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Technical Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-2">
                                <ul className="space-y-4">
                                    {(candidate.aiFeedbackPositive || candidate.insights?.strengths || []).map((strength: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/40 p-1 rounded-full shrink-0">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="p-0 overflow-hidden border-amber-400 dark:border-amber-900/30 shadow-sm bg-white dark:bg-slate-900">
                            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-400 dark:border-amber-900/30 px-6 pt-6 pb-2">
                                <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center gap-2 text-lg">
                                    <Info className="h-5 w-5" />
                                    Areas for Improvement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-2">
                                <ul className="space-y-4">
                                    {(candidate.aiFeedbackImprovements || candidate.insights?.improvements || []).map((improvement: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            <div className="mt-0.5 bg-amber-100 dark:bg-amber-900/40 p-1 rounded-full shrink-0">
                                                <TriangleAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            {improvement}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* --- 4. GitHub Timeline --- */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-slate-300 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-lg">
                                    <GitCommitHorizontal className="h-5 w-5 text-slate-500" />
                                    Development Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 md:ml-4 pl-6 md:pl-8 space-y-8">
                                    {(candidate.commits || []).slice().reverse().map(
                                        (commit: { id: string | number; time: string; message: string }, i: number, allCommits: any[]) => (
                                            <div key={i} className="relative mb-8 last:mb-0">
                                                <div className="absolute -left-[31px] md:-left-[39px] top-[5px] h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-900 z-10" />

                                                {i === allCommits.length - 1 && (
                                                    <div className="absolute -left-[31px] md:-left-[39px] top-[5px] h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse z-20" />
                                                )}

                                                <div className="flex flex-col space-y-1 group pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800">
                                                            {commit.id}
                                                        </Badge>
                                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                                            {commit.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                        {commit.message}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}