'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Eye, Search, Filter, CheckCircle2, XCircle, Clock, AlertTriangle, ClipboardList, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/forms/button';
import { Input } from '@/components/ui/forms/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/data-display/table';
import { Badge } from '@/components/ui/data-display/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/forms/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/overlays/dialog';
import { Skeleton } from '@/components/ui/feedback/skeleton';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Progress } from '@/components/ui/feedback/progress';
import { apiFetch } from '@/lib/api/apiClient';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

type ApplicationStatus =
    | 'PENDING'
    | 'TECHNICAL_REVIEW'
    | 'PASSED'
    | 'HIRED'
    | 'NOT_SELECTED'
    | 'CANCELLED';

interface Application {
    id: string;
    project_title: string;
    company_name: string;
    applied_at: string;
    status: ApplicationStatus;
    score?: number;
    evaluation?: {
        role_fit_score: number;
        code_quality: number;
        efficiency: number;
        cheating_risk: number;
        ai_summary: string;
    };
}

// ─── Status Config ────────────────────────────────────────────────────────────

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    TECHNICAL_REVIEW: { label: 'In Review', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye },
    PASSED: { label: 'Passed', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
    HIRED: { label: 'Hired', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle2 },
    NOT_SELECTED: { label: 'Not Selected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
};

// ─── Map raw Django response to Application type ──────────────────────────────

function mapApplication(a: any): Application {
    return {
        id: String(a.id),
        project_title: a.project_title ?? a.project?.title ?? 'Untitled',
        company_name: a.company_name ?? a.project?.company_name ?? '—',
        applied_at: a.applied_at ?? a.submitted_at ?? new Date().toISOString(),
        status: a.status ?? 'PENDING',
        score: a.role_fit_score ?? a.score ?? undefined,
        evaluation: (
            a.role_fit_score != null ||
            a.code_quality != null ||
            a.efficiency != null
        ) ? {
            role_fit_score: a.role_fit_score ?? 0,
            code_quality: a.code_quality ?? 0,
            efficiency: a.efficiency ?? 0,
            cheating_risk: a.cheating_risk ?? 0,
            ai_summary: a.ai_summary ?? '',
        } : undefined,
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // BUG-4.3: Delete confirmation dialog state
    const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // ── Fetch real data from Django ──────────────────────────────────────────
    useEffect(() => {
        async function fetchApplications() {
            try {
                setLoading(true);
                const data = await apiFetch<any[]>('/api/my-applications/');
                const mapped = (Array.isArray(data) ? data : (data as any).results ?? []).map(mapApplication);
                setApplications(mapped);
            } catch (err: any) {
                setError(err?.message ?? 'Failed to load applications');
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    // ── BUG-4.3: Delete application with optimistic update ──────────────────
    const handleDeleteClick = (application: Application) => {
        setDeleteTarget(application);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        const targetId = deleteTarget.id;
        setDeleting(true);

        // Optimistic: remove the row immediately
        setApplications((prev) => prev.filter((a) => a.id !== targetId));
        setDeleteConfirmOpen(false);

        try {
            const res = await apiFetch<any>(`/api/projects/my-applications/${targetId}/`, {
                method: 'DELETE',
            });
            if (res === null || res === undefined || res.success) {
                toast.success('Application deleted successfully');
            }
        } catch {
            // Rollback: re-fetch on failure since we already removed the row
            toast.error('Failed to delete application');
            try {
                const data = await apiFetch<any[]>('/api/my-applications/');
                const mapped = (Array.isArray(data) ? data : (data as any).results ?? []).map(mapApplication);
                setApplications(mapped);
            } catch {
                // If re-fetch also fails, the user can refresh manually
            }
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const matchesSearch =
                app.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [applications, searchTerm, statusFilter]);

    const stats = useMemo(() => ({
        total: applications.length,
        pending: applications.filter((a) => a.status === 'PENDING').length,
        passed: applications.filter((a) => a.status === 'PASSED' || a.status === 'HIRED').length,
        rejected: applications.filter((a) => a.status === 'NOT_SELECTED').length,
    }), [applications]);

    const handleViewDetails = (application: Application) => {
        setSelectedApplication(application);
        setDetailsOpen(true);
    };

    // ── Loading skeleton ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <Card>
                    <CardContent className="pt-6 text-center text-red-500">
                        <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <ClipboardList size={20} />
                    </div>
                    My Applications
                </h1>
                <p className="text-muted-foreground">Track and manage all your job applications in one place</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Applications Card */}
                <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                        <Eye className="h-32 w-32 text-purple-600" />
                    </div>
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shadow-sm">
                                <Eye className="h-6 w-6 text-purple-600" />
                            </div>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                Total
                            </Badge>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                                {stats.total}
                            </p>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Passed / Hired Card */}
                <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                        <CheckCircle2 className="h-32 w-32 text-emerald-600" />
                    </div>
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                Success
                            </Badge>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-emerald-600 tracking-tighter mb-1">
                                {stats.passed}
                            </p>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Passed / Hired</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Review Card */}
                <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white overflow-hidden relative rounded-2xl transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                        <Clock className="h-32 w-32 text-amber-600" />
                    </div>
                    <CardContent className="pt-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shadow-sm">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold border-none">
                                In Progress
                            </Badge>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-amber-600 tracking-tighter mb-1">
                                {stats.pending}
                            </p>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Card */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by project or company name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="TECHNICAL_REVIEW">In Review</SelectItem>
                                <SelectItem value="PASSED">Passed</SelectItem>
                                <SelectItem value="HIRED">Hired</SelectItem>
                                <SelectItem value="NOT_SELECTED">Not Selected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Project</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Applied Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No applications found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredApplications.map((application) => {
                                        const config = statusConfig[application.status];
                                        const Icon = config.icon;
                                        return (
                                            <TableRow key={application.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">{application.project_title}</TableCell>
                                                <TableCell className="text-muted-foreground">{application.company_name}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {format(new Date(application.applied_at), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${config.color} flex items-center gap-1 w-fit`}
                                                    >
                                                        <Icon className="h-3 w-3" />
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {application.score != null ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold min-w-[3ch]">{application.score}%</span>
                                                            <Progress value={application.score} className="w-24 h-2" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(application)}
                                                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {/* BUG-4.3: Delete button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(application)}
                                                            disabled={deleting}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            title="Delete application"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredApplications.length > 0 && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {filteredApplications.length} of {applications.length} applications
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>Review your application evaluation and feedback</DialogDescription>
                    </DialogHeader>

                    {selectedApplication && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Project</p>
                                    <p className="font-medium">{selectedApplication.project_title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Company</p>
                                    <p className="font-medium">{selectedApplication.company_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
                                    <p className="font-medium">
                                        {format(new Date(selectedApplication.applied_at), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                                    <Badge
                                        variant="outline"
                                        className={`${statusConfig[selectedApplication.status].color} flex items-center gap-1 w-fit`}
                                    >
                                        {statusConfig[selectedApplication.status].label}
                                    </Badge>
                                </div>
                            </div>

                            {selectedApplication.evaluation ? (
                                <>
                                    <div className="border-t pt-6">
                                        <h3 className="font-semibold mb-4">Evaluation Scores</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Role Fit', value: selectedApplication.evaluation.role_fit_score },
                                                { label: 'Code Quality', value: selectedApplication.evaluation.code_quality },
                                                { label: 'Efficiency', value: selectedApplication.evaluation.efficiency },
                                            ].map(({ label, value }) => (
                                                <div key={label}>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm">{label}</span>
                                                        <span className="text-sm font-semibold">{value}%</span>
                                                    </div>
                                                    <Progress value={value} className="h-2" />
                                                </div>
                                            ))}
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm">Cheating Risk</span>
                                                    <span className={`text-sm font-semibold ${selectedApplication.evaluation.cheating_risk > 20
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                        }`}>
                                                        {selectedApplication.evaluation.cheating_risk}%
                                                    </span>
                                                </div>
                                                <Progress value={selectedApplication.evaluation.cheating_risk} className="h-2" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="font-semibold mb-3">AI Evaluation Summary</h3>
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="text-sm leading-relaxed">
                                                {selectedApplication.evaluation.ai_summary || 'No summary available yet.'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="border-t pt-6 text-center text-muted-foreground">
                                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                    <p className="text-sm">Evaluation not available yet. Check back after your project is reviewed.</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* BUG-4.3: Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="max-w-md" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Delete Application?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your application
                            {deleteTarget ? ` for "${deleteTarget.project_title}"` : ''}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmOpen(false)}
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
