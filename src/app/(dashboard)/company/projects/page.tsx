"use client";

import React, { useState } from "react";
import { Search, Users, CheckCircle, Calendar, Plus, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/forms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";
import { Badge } from "@/components/ui/data-display/badge";
import { Progress } from "@/components/ui/feedback/progress";
import ShimmerButton from "@/components/vendors/magicui/shimmer-button";
import { HoverEffect } from "@/components/vendors/aceternity/card-hover-effect";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { useProject } from "@/lib/contexts/ProjectContext";
import { PageShell } from "@/components/shared/PageShell";

export default function AllProjectsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { projects } = useProject();
    const filteredProjects = projects.filter((p: { title: string; status: string }) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "bg-emerald-500";
            case "Published": return "bg-emerald-500";
            case "Draft": return "bg-amber-500";
            case "Completed": return "bg-purple-600";
            default: return "bg-slate-400";
        }
    };

    // Format data for Aceternity HoverEffect while preserving our custom visual structure.
    // The HoverEffect component expects { title, description, link }.
    // We will pass the title and link, and use the `description` field to render our custom ReactNode UI.
    const hoverItems = filteredProjects.map((project: any) => ({
        title: project.title,
        link: project.link,
        description: (
            <div className="flex flex-col gap-5 mt-2 h-full justify-between">

                {/* Badges & Status Row */}
                <div className="flex items-center justify-between">
                    {project.type === 'Team' && (
                        <Badge variant="default" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            Team Project
                        </Badge>
                    )}
                    {project.type === 'Individual' && (
                        <Badge variant="default" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                            Individual
                        </Badge>
                    )}
                    <div className="flex items-center gap-1.5 opacity-80 pt-0.5">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`} />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            {project.status === "Active" ? "Published" : project.status}
                        </span>
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                        <Users className="h-4 w-4" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{project.applicants}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400 border-x border-slate-100 dark:border-slate-800">
                        <CheckCircle className="h-4 w-4 text-emerald-500/80" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{project.passed}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4 text-blue-500/80" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{project.daysLeft ? `${project.daysLeft}d` : '—'}</span>
                    </div>
                </div>

                {/* Progress Bar Row */}
                <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>Recruitment Progress</span>
                        <span className="text-purple-700 dark:text-purple-400">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                </div>

                {/* Footer CTA */}
                <Link href={`/company/projects/${project.id}`} prefetch={true}>
                    <div className="pt-2">
                        <button className="w-full py-2.5 text-sm font-semibold rounded-xl bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-colors border border-slate-200 dark:border-slate-700">
                            View Details
                        </button>
                    </div>
                </Link>
            </div>
        )
    }));

    return (
        <div className="w-full bg-transparent relative min-h-screen overflow-hidden">

            {/* Main Content Area */}
            <PageShell className="relative z-10 space-y-8" padding="default" width="default">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-6 pb-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            All Projects
                        </h1>

                    {/* Controls row — 12 px gap between all elements, no stray margins */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative w-64 shrink-0">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 bg-white dark:bg-slate-900/50 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-visible:ring-purple-500"
                            />
                        </div>

                        {/* Status filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-9 w-40 bg-white dark:bg-slate-900/50 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm font-medium text-slate-700 dark:text-slate-300">
                                <SelectValue placeholder="All Projects" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                <SelectItem value="all">All Projects</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Create Project — flush right, no extra wrapper margin */}
                        <ShimmerButton
                            className="shadow-xl h-9 shrink-0"
                            shimmerSize="0.1em"
                            borderRadius="0.75rem"
                            background="linear-gradient(115deg, #6b21a8, #7c3aed, #d97706)"
                            onClick={() => router.push("/company/projects/create")}
                        >
                            <span className="whitespace-pre-wrap text-center text-sm font-semibold leading-none tracking-tight text-white flex items-center gap-1.5 px-2">
                                <Plus className="h-4 w-4" />
                                Create Project
                            </span>
                        </ShimmerButton>
                    </div>
                </header>

                {/* Render Grid or Empty State */}
                {filteredProjects.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, staggerChildren: 0.1 }}
                        className="w-full"
                    >
                        {/* 
                            We must cast the items slightly as CardHoverEffect expects a string description, 
                            but we are passing a ReactNode. We will forcefully map it or suppress if needed.
                        */}
                        <HoverEffect items={hoverItems as any} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center"
                    >
                        <div className="h-24 w-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-purple-600 dark:text-purple-400 opacity-80" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                            {searchQuery ? "We couldn't find any projects matching your search criteria." : "You haven't created any projects yet. Start by generating your first evaluation!"}
                        </p>

                        {!searchQuery && (
                            <div onClick={() => router.push("/company/projects/create")}>
                                <ShimmerButton className="shadow-lg min-w-[200px]" shimmerColor="#9333ea" borderRadius="0.75rem" background="linear-gradient(115deg, #6b21a8, #7c3aed, #d97706)">
                                    <span className="whitespace-pre-wrap text-center text-sm font-semibold leading-none tracking-tight text-white flex items-center gap-1.5 justify-center">
                                        <Plus className="h-4 w-4" />
                                        Create First Project
                                    </span>
                                </ShimmerButton>
                            </div>
                        )}
                    </motion.div>
                )}

            </PageShell>
        </div>
    );
}
