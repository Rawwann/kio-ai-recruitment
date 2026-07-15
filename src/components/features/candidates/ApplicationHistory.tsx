'use client';

import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/data-display/table';
import { Badge } from '@/components/ui/data-display/badge';
import { Briefcase, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/forms/button';
import type { ApplicationHistoryItem } from '@/types/candidate';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/navigation/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/overlays/dialog';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api/apiClient';
import { Loader2, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ApplicationHistoryProps {
    applications: ApplicationHistoryItem[];
}

const statusConfig: Record<
    ApplicationHistoryItem['status'],
    { label: string; className: string }
> = {
    inprogress:   { label: 'In Progress',  className: 'bg-orange-100 text-orange-700 border-orange-200' },
    passed:       { label: 'Passed',        className: 'bg-green-100 text-green-700 border-green-200'   },
    under_review: { label: 'Under Review',  className: 'bg-blue-100 text-blue-700 border-blue-200'      },
    not_selected: { label: 'Not Selected',  className: 'bg-red-100 text-red-700 border-red-200'          },
};

export function ApplicationHistory({ applications }: ApplicationHistoryProps) {
    const router = useRouter();
    const [deleteTarget, setDeleteTarget] = useState<ApplicationHistoryItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [hiddenApps, setHiddenApps] = useState<Set<string>>(new Set());

    const visibleApplications = applications.filter((a) => !hiddenApps.has(a.id));

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const targetId = deleteTarget.id;
        setDeleting(true);
        // Optimistic update
        setHiddenApps((prev) => new Set(prev).add(targetId));
        setDeleteTarget(null);

        try {
            const res = await apiFetch<any>(`/api/projects/my-applications/${targetId}/`, {
                method: 'DELETE',
            });
            if (res === null || res === undefined || res.success) {
                toast.success('Application deleted successfully');
            }
        } catch {
            toast.error('Failed to delete application');
            setHiddenApps((prev) => {
                const next = new Set(prev);
                next.delete(targetId);
                return next;
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Application History
                </h2>
                <Link href="/candidate/applications">
                    <Button variant="link" className="text-purple-600">
                        View All
                    </Button>
                </Link>
            </div>

<div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
    <Table>
        <TableHeader>
            <TableRow className="bg-muted/30 border-none">
                <TableHead className="font-semibold px-6 py-4">Position</TableHead>
                <TableHead className="font-semibold px-6 py-4">Company</TableHead>
                <TableHead className="font-semibold px-6 py-4">Date</TableHead>
                <TableHead className="font-semibold px-6 py-4">Status</TableHead>
                <TableHead className="w-[50px] px-6 py-4"></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
                        {visibleApplications.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    <p className="font-medium text-gray-700 dark:text-gray-300">
                                        No application history yet
                                    </p>
                                    <p className="mt-1 text-sm">
                                        Your past and completed applications will appear here.
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            visibleApplications.map((application) => {
                                const config = statusConfig[application.status];
                                return (
                                    <TableRow
                                        key={application.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <span>{application.jobTitle}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {application.company}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {format(new Date(application.appliedAt), 'dd MMM')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={config.className}
                                            >
                                                {config.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/candidate/projects/${application.projectId || application.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteTarget(application)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Application
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="max-w-md" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Delete Application?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your application
                            {deleteTarget ? ` for "${deleteTarget.jobTitle}"` : ''}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
