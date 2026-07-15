'use client';

import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import type { AvailableProject } from '@/types/candidate';
import { cn } from '@/lib/utils';
import { normalizeSkillList } from '@/lib/utils/projectSkills';

interface ProjectCardProps {
    project: AvailableProject;
}

const difficultyPillClass: Record<string, string> = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
    Advanced: "bg-secondary text-secondary-foreground border-accent",
    JUNIOR: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MIDDLE: "bg-blue-50 text-blue-700 border-blue-200",
    SENIOR: "bg-secondary text-secondary-foreground border-accent",
};

export function ProjectCard({ project }: ProjectCardProps) {
    const { id, title, company_name, role, days_left, daysLeft, required_skills, requiredSkills } =
        project;
    // Django ProjectSerializer returns camelCase; handle both
    const difficulty_level = project.difficultyLevel ?? project.difficulty_level;
    const is_team_project = project.isTeamProject ?? project.is_team_project;

    const skills = normalizeSkillList(required_skills, requiredSkills);

    const deadline = days_left ?? daysLeft;
    const displayCompany = company_name?.trim() || 'Company';
    const companyInitials = (displayCompany?.slice(0, 2) || '—').toUpperCase();
    const safeTitle = title?.trim() || 'Untitled project';
    const projectHref = id != null && !Number.isNaN(Number(id)) ? `/candidate/projects/${id}` : '/candidate/projects';

    return (
        <Link href={projectHref} prefetch={true} className="block group">
            <div
                className="relative overflow-hidden rounded-xl border bg-card/70 backdrop-blur transition-shadow duration-200 shadow-sm group-hover:shadow-md h-full"
            >
                <div className="px-6 pt-6 pb-4 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="shrink-0 size-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground"
                            >
                                <span className="text-xs font-medium">{companyInitials}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">{displayCompany}</p>
                                {role && <p className="text-xs text-muted-foreground">{role}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {difficulty_level && (() => {
                                const dl = difficulty_level.toLowerCase();
                                const isEasy = dl === 'beginner' || dl === 'easy' || dl === 'junior';
                                const isMedium = dl === 'intermediate' || dl === 'medium' || dl === 'middle';
                                const isHard = dl === 'advanced' || dl === 'hard' || dl === 'senior';
                                const label = isEasy ? 'Easy' : isMedium ? 'Medium' : isHard ? 'Hard' : difficulty_level;
                                const colorCls = isEasy
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : isMedium
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : isHard
                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                            : "bg-slate-50 text-slate-600 border-slate-200";
                                return (
                                    <div
                                        className={cn(
                                            "shrink-0 flex items-center justify-center px-2 py-0.5 rounded-full border",
                                            colorCls,
                                        )}
                                    >
                                        <span className="whitespace-nowrap text-[10px] font-semibold">
                                            {label}
                                        </span>
                                    </div>
                                );
                            })()}
                            {is_team_project === true && (
                                <div className="shrink-0 flex items-center justify-center px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200">
                                    <span className="whitespace-nowrap text-[10px]">Team Project</span>
                                </div>
                            )}
                            {is_team_project === false && (
                                <div className="shrink-0 flex items-center justify-center px-2 py-0.5 rounded-full border bg-purple-100 text-purple-700 border-purple-200">
                                    <span className="whitespace-nowrap text-[10px]">Individual</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed text-foreground line-clamp-2 min-h-[2.5rem]">{safeTitle}</p>

                    <div className="flex flex-wrap gap-2 min-h-[28px]">
                        {(skills?.slice(0, 3) ?? []).map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center px-2 py-0.5 rounded-full border bg-secondary text-secondary-foreground"
                            >
                                <span className="whitespace-nowrap text-[10px]">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mx-6 h-px bg-border" />

                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">
                            {deadline != null ? `${deadline} days left` : 'No deadline'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] text-primary">Details</span>
                        <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </div>
                </div>
            </div>
        </Link>
    );
}