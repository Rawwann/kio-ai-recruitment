'use client';

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Upload, FileText, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/forms/button';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Progress } from '@/components/ui/feedback/progress';
import { toast } from 'sonner';
import type { UserProfile } from '@/types/candidate';

interface CVUploadProps {
    profile: UserProfile;
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
}

export function CVUpload({ profile, onUpload, isUploading }: CVUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccess, setShowSuccess]       = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasCv      = !!profile.cv_file_name;

    // ── File selection & upload ──────────────────────────────────────────────
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a PDF or DOCX file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5 MB');
            return;
        }

        setUploadProgress(0);
        setShowSuccess(false);

        // Animate progress bar independently of the real upload
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) { clearInterval(interval); return prev; }
                return prev + 10;
            });
        }, 200);

        try {
            await onUpload(file);
            clearInterval(interval);
            setUploadProgress(100);
            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 3000);
        } catch {
            clearInterval(interval);
            setUploadProgress(0);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── Download ─────────────────────────────────────────────────────────────
    const handleDownload = () => {
        if (!profile.cv_file_url || !profile.cv_file_name) return;
        const a = document.createElement('a');
        a.href     = profile.cv_file_url;
        a.download = profile.cv_file_name;
        a.target   = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6">

            {/* ── Existing CV info ─────────────────────────────────────────── */}
            {hasCv && (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        {/* File header row */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 truncate">
                                    {profile.cv_file_name}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Uploaded on{' '}
                                    {profile.cv_uploaded_at
                                        ? format(new Date(profile.cv_uploaded_at), 'PPP')
                                        : 'N/A'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    disabled={!profile.cv_file_url}
                                    className="gap-1.5"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>


                    </CardContent>
                </Card>
            )}

            {/* ── Upload / replace section ─────────────────────────────────── */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                            <Upload className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {hasCv ? 'Replace Your CV' : 'Upload Your CV'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Supported formats: PDF, DOCX · Max 5 MB
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isUploading}
                        />

                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full bg-purple-600 hover:bg-purple-700 kio-btn-ai-primary"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose File
                                </>
                            )}
                        </Button>

                        {isUploading && uploadProgress > 0 && (
                            <div className="mt-4 space-y-2">
                                <Progress value={uploadProgress} className="h-2" />
                                <p className="text-sm text-muted-foreground">{uploadProgress}% uploaded</p>
                            </div>
                        )}

                        {showSuccess && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="text-sm font-medium">CV uploaded successfully!</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Tips ─────────────────────────────────────────────────────── */}
            <Card>
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">CV Tips</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                            'Keep your CV updated with your latest experience and skills',
                            'Use a clear, professional format',
                            'Highlight relevant projects and achievements',
                            'Ensure your contact information is current',
                        ].map((tip) => (
                            <li key={tip} className="flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
