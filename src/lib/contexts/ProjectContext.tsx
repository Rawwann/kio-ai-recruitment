"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Applicant, Project, type ProjectContextType } from "@/types";
import { getCompanyProjects } from "@/lib/api/companyService";
import { mapCompanyProjectToProject } from "@/lib/api/projectMappers";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const isCompany = session?.user?.user_type === "COMPANY";

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    const refreshProjects = useCallback(async () => {
        setProjectsLoading(true);
        try {
            const rows = await getCompanyProjects();
            setProjects(rows.map((r) => mapCompanyProjectToProject(r)));
        } catch {
            setProjects([]);
        } finally {
            setProjectsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || !isCompany) {
            setProjects([]);
            setProjectsLoading(false);
            return;
        }
        void refreshProjects();
    }, [status, isCompany, refreshProjects]);

    const addProject = (project: Project) => {
        setProjects((prev) => [project, ...prev]);
    };

    const updateProject = (id: string, updatedData: Partial<Project>) => {
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    };

    const updateCandidateStatus = (candidateId: string, status: Applicant["status"]) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.applicantsList && p.applicantsList.some((a) => a.id === candidateId)) {
                    return {
                        ...p,
                        applicantsList: p.applicantsList.map((a) =>
                            a.id === candidateId ? { ...a, status } : a,
                        ),
                    };
                }
                return p;
            }),
        );
    };

    return (
        <ProjectContext.Provider
            value={{ projects, addProject, updateProject, updateCandidateStatus, refreshProjects, projectsLoading }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
