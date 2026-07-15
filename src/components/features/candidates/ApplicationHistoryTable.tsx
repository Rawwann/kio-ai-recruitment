'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/data-display/table';
import { Badge } from '@/components/ui/data-display/badge';
import { Button } from '@/components/ui/forms/button';
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
import { MoreHorizontal, Eye, Trash2, Loader2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api/apiClient';
import type { ApplicationHistoryItem } from '@/types/candidate';

interface ApplicationHistoryTableProps {
    applications: ApplicationHistoryItem[];
}

const statusColorMap: Record<ApplicationHistoryItem['status'], string> = {
    inprogress:   'bg-orange-100 text-orange-700 border-orange-200',
    passed:       'bg-green-100 text-green-700 border-green-200',
    under_review: 'bg-blue-100 text-blue-700 border-blue-200',
    not_selected: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabel: Record<ApplicationHistoryItem['status'], string> = {
    inprogress:   'In Progress',
    passed:       'Passed',
    under_review: 'Under Review',
    not_selected: 'Not Selected',
};

export function ApplicationHistoryTable({ applications }: ApplicationHistoryTableProps) {
    const router = useRouter();
    const [deleteTarget, setDeleteTarget] = useState<ApplicationHistoryItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [hiddenApps, setHiddenApps] = useState<Set<string>>(new Set());

    const visibleApplications = applications.filter((a) => !hiddenApps.has(a.id));

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        const targetId = deleteTarget.id;
        setDeleting(true);
        // Optimistic update: hide the row immediately
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
            // Rollback: show the row again
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
        <div className="space-y-0">
            <div className="rounded-md border overflow-hidden">
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
                            visibleApplications.map((app) => (
                                <TableRow key={app.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <span>{app.jobTitle}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{app.company}</TableCell>
                                    <TableCell className="text-gray-600">
                                        {format(new Date(app.appliedAt), 'dd MMM')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={statusColorMap[app.status]}
                                        >
                                            {statusLabel[app.status]}
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
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/candidate/projects/${app.projectId || app.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => setDeleteTarget(app)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Application
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
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