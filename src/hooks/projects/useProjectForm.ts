"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import { useProject } from "@/lib/contexts/ProjectContext";
import { toast } from "sonner";
import { createProject, updateProject as updateProjectApi, getProjectById, type CreateProjectPayload } from "@/lib/api/companyService";
import { ApiError } from "@/lib/api/apiClient";
import { mapCompanyProjectToProject } from "@/lib/api/projectMappers";

const DIFF_MAP: Record<string, CreateProjectPayload["difficulty_level"]> = {
    junior: "JUNIOR",
    middle: "MIDDLE",
    senior: "SENIOR",
};

/** Dropdown now passes full URLs; this helper just trims and returns them. */
function resolveStarterTemplateUrl(urlOrSlug: string): string {
    const t = (urlOrSlug || "").trim();
    if (!t) return "";
    return t;
}

function buildPayload(
    activeTab: string,
    title: string,
    description: string,
    date: Date | undefined,
    tags: string[],
    difficulty: string,
    passingScore: string,
    starterTemplate: string,
    baseRepo: string,
    teamRoles: { role: string; count: number }[],
    status: "Active" | "Draft",
): CreateProjectPayload {
    const d = difficulty in DIFF_MAP ? DIFF_MAP[difficulty] : "JUNIOR";
    const passNum = Math.min(100, Math.max(0, Number.parseInt(passingScore, 10) || 70));
    const base: CreateProjectPayload = {
        title: title.trim(),
        description: description.trim(),
        difficulty_level: d,
        requiredSkills: tags,
        tags,
        visibility: "public",
        deadline: date ? date.toISOString() : null,
        role: "Team simulation",
        passingScore: passNum,
        estimatedHours: 24,
        overview: description.trim(),
        goals: "",
        tasksRequirements: "",
        deliverables: "",
        nextSteps: "",
        isTeamProject: activeTab === "team",
    };
    base.status = status === "Active" ? "published" : "draft";
    if (activeTab === "individual") {
        base.starterTemplate = resolveStarterTemplateUrl(starterTemplate);
        base.teamRoles = [];
    } else {
        base.baseRepo = baseRepo;
        base.teamRoles = teamRoles;
    }
    return base;
}

export function useProjectForm(projectId?: string) {
    const { addProject, updateProject, projects, refreshProjects } = useProject();
    const existingProject = projects.find((p) => p.id === projectId);
    const isEditMode = !!existingProject;
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("individual");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const [starterTemplate, setStarterTemplate] = useState("");
    const [baseRepo, setBaseRepo] = useState("");
    const [passingScore, setPassingScore] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [codeQuality, setCodeQuality] = useState([80]);
    const [performance, setPerformance] = useState([50]);
    const [documentation, setDocumentation] = useState([90]);
    const [bestPractices, setBestPractices] = useState([70]);

    const [collaboration, setCollaboration] = useState([85]);
    const [prQuality, setPrQuality] = useState([75]);
    const [codeReview, setCodeReview] = useState([60]);
    const [workload, setWorkload] = useState([80]);

    const [teamRoles, setTeamRoles] = useState([{ role: "", count: 1 }]);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    const addRole = () => setTeamRoles([...teamRoles, { role: "", count: 1 }]);
    const removeRole = (index: number) => setTeamRoles(teamRoles.filter((_, i) => i !== index));
    const updateRole = (index: number, field: "role" | "count", value: string | number) => {
        const newRoles = [...teamRoles];
        newRoles[index] = { ...newRoles[index], [field]: value };
        setTeamRoles(newRoles);
        if (field === "role" && errors[`role_${index}`]) {
            setErrors((prev) => ({ ...prev, [`role_${index}`]: "" }));
        }
        if (errors.teamRoles) {
            setErrors((prev) => ({ ...prev, teamRoles: "" }));
        }
    };

    const handleAddTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setInputValue("");
            if (errors.skills) {
                setErrors((prev) => ({ ...prev, skills: "" }));
            }
        }
    };
    const handleRemoveTag = (tagToRemove: string) => setTags(tags.filter((tag) => tag !== tagToRemove));
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag(inputValue);
        }
    };

    const handleCopy = useCallback(() => {
        if (!shareUrl) return;
        void navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }, [shareUrl]);

    // Hydrate edit mode from API (context may be stale)
    useEffect(() => {
        if (!isEditMode || !projectId) return;
        let cancelled = false;
        (async () => {
            try {
                const p = await getProjectById(Number(projectId));
                if (cancelled) return;
                setTitle(p.title);
                setDescription(p.description || "");
                const dl = p.deadline ? new Date(p.deadline) : undefined;
                if (p.days_left != null && p.days_left > 0) {
                    const d = new Date();
                    d.setDate(d.getDate() + p.days_left);
                    setDate(d);
                } else if (dl) {
                    setDate(dl);
                } else {
                    setDate(undefined);
                }
                const raw = p.difficultyLevel ?? p.difficulty_level ?? "";
                const level = String(raw).toLowerCase();
                if (level.includes("junior") || level === "junior") setDifficulty("junior");
                else if (level.includes("intermediate") || level.includes("middle") || level === "middle")
                    setDifficulty("middle");
                else if (level.includes("senior") || level === "senior") setDifficulty("senior");
                if (p.required_skills?.length) setTags(p.required_skills);
                const isTeam = p.isTeamProject === true || p.is_team_project === true;
                setActiveTab(isTeam ? "team" : "individual");
                if (p.starterTemplate) setStarterTemplate(p.starterTemplate);
                if (p.baseRepo) setBaseRepo(p.baseRepo);
                if (p.passingScore != null) setPassingScore(String(p.passingScore));
                const tr = p.teamRoles;
                if (Array.isArray(tr) && tr.length) {
                    setTeamRoles(
                        tr.map((row: { role?: string; count?: number }) => ({
                            role: String(row?.role ?? ""),
                            count: typeof row?.count === "number" ? row.count : 1,
                        })),
                    );
                }
            } catch {
                if (!cancelled) toast.error("Could not load project for editing");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [isEditMode, projectId]);

    useEffect(() => {
        if (existingProject && !projectId) return;
        if (existingProject && isEditMode) {
            setActiveTab(existingProject.type === "Team" ? "team" : "individual");
            if (!title) setTitle(existingProject.title);
            const d = new Date();
            d.setDate(d.getDate() + (existingProject.daysLeft || 7));
            if (!date) setDate(d);
            setStarterTemplate(existingProject.starterTemplate || "");
            setBaseRepo(existingProject.baseRepo || "");
            setPassingScore(String(existingProject.passingScore || ""));
            if (!description) setDescription(existingProject.description || "");
            if (existingProject.difficulty) {
                const x = String(existingProject.difficulty).toLowerCase();
                if (x.includes("intermediate") || x.includes("middle")) setDifficulty("middle");
                else if (x.includes("senior")) setDifficulty("senior");
                else setDifficulty("junior");
            }
            if (existingProject.teamRoles) setTeamRoles(existingProject.teamRoles);
            if (existingProject.tags) setTags(existingProject.tags);
        }
    }, [existingProject, isEditMode, projectId, title, description, date]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Project Title is required";
        if (tags.length === 0) newErrors.skills = "At least one skill is required";
        if (!difficulty) newErrors.difficulty = "Please select a difficulty level";
        if (!description.trim()) newErrors.description = "Detailed description is required";

        if (activeTab === "individual") {
            if (!starterTemplate) newErrors.starterTemplate = "Starter Template is required";
            if (!passingScore) newErrors.passingScore = "Passing score is required";
        } else {
            if (!baseRepo.trim()) newErrors.baseRepo = "Base repository is required";
            if (!passingScore) newErrors.passingScore = "Passing score is required";
            let hasInvalidRole = false;
            teamRoles.forEach((r, i) => {
                if (!r.role) {
                    newErrors[`role_${i}`] = "Please select a role";
                    hasInvalidRole = true;
                }
            });
            if (hasInvalidRole) newErrors.teamRoles = "Please fill in all team roles";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (submitStatus: "Active" | "Draft") => {
        if (!validateForm()) {
            toast.error("Error: Please fill in all required fields");
            return;
        }

        void (async () => {
            const payload = buildPayload(
                activeTab,
                title,
                description,
                date,
                tags,
                difficulty,
                passingScore,
                starterTemplate,
                baseRepo,
                teamRoles,
                submitStatus,
            );

            try {
                if (isEditMode && projectId) {
                    await updateProjectApi(Number(projectId), payload);
                    updateProject(projectId, {
                        title: title.trim(),
                        type: activeTab === "individual" ? "Individual" : "Team",
                        status: submitStatus,
                        daysLeft: date ? Math.max(0, differenceInDays(date, new Date())) : 0,
                        starterTemplate: activeTab === "individual" ? starterTemplate : undefined,
                        baseRepo: activeTab === "team" ? baseRepo : undefined,
                        passingScore: parseInt(passingScore, 10) || 0,
                        difficulty,
                        description: description.trim(),
                        teamRoles: activeTab === "team" ? teamRoles : undefined,
                        tags,
                    });
                    await refreshProjects();
                    toast.success("Project updated successfully");
                    router.push(`/company/projects/${projectId}`);
                    return;
                }

                const created = await createProject(payload);
                const mapped = mapCompanyProjectToProject(created);
                addProject(mapped);
                await refreshProjects();
                const origin = typeof window !== "undefined" ? window.location.origin : "";
                setShareUrl(`${origin}/candidate/projects/${created.id}`);

                if (submitStatus === "Active") {
                    setIsDialogOpen(true);
                    setTimeout(() => router.push("/company/projects"), 2000);
                } else {
                    toast.success("Project saved as draft");
                    router.push("/company/projects");
                }
            } catch (e) {
                if (e instanceof ApiError) {
                    toast.error(e.message);
                } else {
                    const msg = e instanceof Error ? e.message : "Could not save project";
                    toast.error(msg);
                }
            }
        })();
    };

    return {
        isEditMode,
        activeTab,
        setActiveTab,
        title,
        setTitle,
        date,
        setDate,
        isDialogOpen,
        setIsDialogOpen,
        isCopied,
        shareUrl,
        starterTemplate,
        setStarterTemplate,
        baseRepo,
        setBaseRepo,
        passingScore,
        setPassingScore,
        description,
        setDescription,
        difficulty,
        setDifficulty,
        errors,
        setErrors,
        codeQuality,
        setCodeQuality,
        performance,
        setPerformance,
        documentation,
        setDocumentation,
        bestPractices,
        setBestPractices,
        collaboration,
        setCollaboration,
        prQuality,
        setPrQuality,
        codeReview,
        setCodeReview,
        workload,
        setWorkload,
        teamRoles,
        addRole,
        removeRole,
        updateRole,
        tags,
        inputValue,
        setInputValue,
        handleAddTag,
        handleRemoveTag,
        handleKeyDown,
        handleCopy,
        handleSubmit,
    };
}
