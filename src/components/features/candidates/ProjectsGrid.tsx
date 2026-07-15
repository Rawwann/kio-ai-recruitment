'use client';

import type { AvailableProject } from '@/types/candidate';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridProps {
    projects: AvailableProject[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}