"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useProject } from "@/lib/contexts/ProjectContext";
import { apiFetch, ApiError } from "@/lib/api/apiClient";
import type { Applicant } from "@/types/common";

type EvalApi = {
    applicationId: number;
    name: string;
    email: string;
    aiScore: number;
    match_score?: number | null;
    status: string;
    radarData: { subject: string; A: number; fullMark: number }[];
    insights: { strengths: string[]; improvements: string[] };
    ai_summary: string;
    evaluation_error?: string | null;
    ai_feedback_positive?: string[];
    ai_feedback_improvements?: string[];
    risk: {
        isSafe: boolean;
        trustScore: number;
        logs: { id: number; action: string; time: string; isWarning: boolean }[];
    };
    commits: { id: string; message: string; time: string }[];
    commit_count?: number;
    commit_messages?: string[];
    role: string;
    isTeamProject?: boolean;
    cv_file_url?: string | null;
    grading_weights?: {
        code_quality: number;
        efficiency: number;
        role_fit: number;
        problem_solving: number;
    };
};

function mapStatus(st: string): Applicant["status"] {
    const u = st.toUpperCase();
    if (u === "PASSED" || u === "HIRED") return "Passed";
    if (u === "NOT_SELECTED" || u === "CANCELLED") return "Failed";
    if (u === "FLAGGED") return "Flagged";
    return "In Review";
}

export function useCandidateEvaluation() {
    const params = useParams();
    const { projects, updateCandidateStatus } = useProject();

    const candidateId = params.id as string;

    type ApplicantRow = {
        id: string;
        candidateUserId?: string;
        name?: string;
        email?: string;
        status?: string;
        aiScore?: number | null;
        submissionDate?: string;
        cvUrl?: string;
    };

    const candidateFromProjects = useMemo(() => {
        let foundApplicant: ApplicantRow | null = null;
        for (const project of projects) {
            if (project.applicantsList) {
                const found = project.applicantsList.find(
                    (a) =>
                        a.id === candidateId ||
                        (a as ApplicantRow).candidateUserId === candidateId,
                );
                if (found) {
                    foundApplicant = found as ApplicantRow;
                    break;
                }
            }
        }
        return foundApplicant;
    }, [projects, candidateId]);

    const [remote, setRemote] = useState<EvalApi | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setRemote(null);
            try {
                // Call the correct endpoint directly by user ID to get their evaluation bundle
                const raw = await apiFetch<EvalApi>(
                    `/api/projects/company/candidate-evaluation/${candidateId}/`,
                );

                if (!cancelled) setRemote(raw);
            } catch (err) {
                if (!cancelled) {
                    setRemote(null);
                    // BUG-01 fix: Distinguish "no data" (404) from actual errors.
                    // When both paths 404, the candidate simply has no applications — show gentle message, not error.
                    if (err instanceof ApiError && err.status === 404) {
                        toast.info("No evaluation data available for this candidate yet.");
                    } else {
                        toast.error("Could not load evaluation data.");
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [candidateId]);

    const candidate: Applicant | null = useMemo(() => {
        if (!remote) return null;
        return {
            id: candidateId,
            name: remote.name,
            email: remote.email,
            role: remote.isTeamProject ? "Team Project" : "Individual Project",
            status: mapStatus(remote.status),
            submissionDate: new Date().toISOString(),
            aiScore: remote.match_score ?? remote.aiScore ?? null,
            radarData: remote.radarData,
            risk: remote.risk as Applicant["risk"],
            insights: remote.insights,
            commits: remote.commits?.length ? remote.commits : [],
            cvUrl: remote.cv_file_url ?? undefined,
            gradingWeights: remote.grading_weights,
            evaluationError: remote.evaluation_error,
            aiFeedbackPositive: remote.ai_feedback_positive,
            aiFeedbackImprovements: remote.ai_feedback_improvements,
        };
    }, [remote, candidateId]);

    const [localStatus, setLocalStatus] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (candidate) setLocalStatus(candidate.status);
    }, [candidate]);

    const handleAdvance = () => {
        if (!candidate || !candidateFromProjects) {
            toast.info("Open this candidate from a project applicant list to change application status.");
            return;
        }
        if (localStatus === "Passed") return;
        setLocalStatus("Passed");
        try {
            updateCandidateStatus(candidateFromProjects.id, "Passed");
        } catch (error) {
            console.error("Failed to update context", error);
        }
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast.success(`${candidate.name} has been advanced to 'Passed'!`);
    };

    const handleReject = () => {
        if (!candidate || !candidateFromProjects) {
            toast.info("Open this candidate from a project applicant list to change application status.");
            return;
        }
        if (localStatus === "Failed") return;
        const previousStatus = (localStatus || "In Review") as "Passed" | "Failed" | "In Review" | "Flagged";

        setLocalStatus("Failed");

        toast.error(`${candidate.name} has been rejected.`, {
            action: {
                label: 'Undo',
                onClick: () => {
                    setLocalStatus(previousStatus);
                    updateCandidateStatus(candidateFromProjects.id, previousStatus);
                    toast.success("Rejection cancelled");
                },
            },
        });
        try {
            updateCandidateStatus(candidateFromProjects.id, "Failed");
        } catch (error) {
            setLocalStatus(previousStatus);
            console.error("Failed to update context", error);
            toast.error("Failed to update status. Please try again.");
        }
    };

    return {
        candidate: loading ? null : candidate,
        loading,
        localStatus,
        handleAdvance,
        handleReject,
    };
}
