"use client";

import { useParams } from "next/navigation";
import ProjectForm from "@/components/features/projects/ProjectForm";

export default function EditProjectPage() {
    const params = useParams();
    const projectId = params?.id as string;

    if (!projectId) return null;

    return <ProjectForm projectId={projectId} />;
}
