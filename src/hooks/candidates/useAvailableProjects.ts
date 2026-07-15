import { useEffect, useState, useCallback } from 'react';
import type { AvailableProject } from '@/types/candidate';
import { getAvailableProjects, ProjectsFilters } from '@/lib/api/candidateService';

interface UseAvailableProjectsReturn {
    projects: AvailableProject[];
    total: number;
    isLoading: boolean;
    error: Error | null;
    loadMore: () => Promise<void>;
    refetch: (filters?: ProjectsFilters) => Promise<void>;
    filters: ProjectsFilters;
    setFilters: (filters: ProjectsFilters) => void;
    hasMore: boolean;
}

export function useAvailableProjects(): UseAvailableProjectsReturn {
    const [projects, setProjects] = useState<AvailableProject[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState<ProjectsFilters>({ level: 'ALL', role: 'ALL' });
    const [hasMore, setHasMore] = useState(true);

    const fetchProjects = useCallback(async (reset: boolean = true, newFilters?: ProjectsFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const currentFilters = newFilters || filters;
            const currentPage = reset ? 1 : page;
            const { projects: newProjects, total: totalCount } = await getAvailableProjects(
                currentPage,
                8,
                currentFilters
            );

            if (reset) {
                setProjects(newProjects);
                setPage(1);
            } else {
                setProjects(prev => [...prev, ...newProjects]);
                setPage(prev => prev + 1);
            }
            setTotal(totalCount);
            setHasMore(projects.length + newProjects.length < totalCount);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch'));
        } finally {
            setIsLoading(false);
        }
    }, [filters, page, projects.length]);

    const loadMore = async () => {
        if (!isLoading && hasMore) {
            return fetchProjects(false);
        }
    };

    const refetch = async (newFilters?: ProjectsFilters) => {
        if (newFilters) setFilters(newFilters);
        return fetchProjects(true, newFilters);
    };

    useEffect(() => {
        fetchProjects(true);
    }, [filters]);

    return { projects, total, isLoading, error, loadMore, refetch, filters, setFilters, hasMore };
}