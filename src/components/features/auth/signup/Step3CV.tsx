"use client";

import { Button } from "@/components/ui/forms/button";
import { CloudUpload, FileText, X } from "lucide-react";
import { Step3CVProps } from "@/types";
import { useCVUpload } from "@/hooks/auth/useCVUpload";

export default function Step3CV({ onFileUploaded }: Step3CVProps = {}) {
    const {
        file,
        error,
        getRootProps,
        getInputProps,
        isDragActive,
        removeFile
    } = useCVUpload(onFileUploaded);

    return (
        <div className="w-full space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                    <CloudUpload className="h-6 w-6 text-primary" />
                    Create your profile with AI
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Upload your CV and let our AI extract your information automatically. You&apos;ll be able to
                    review and edit everything before saving.
                </p>
            </div>

            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-white/50"}
                    ${file ? "bg-green-50/50 border-green-300 dark:bg-green-950/20 dark:border-green-800" : "bg-white/50"}
                `}
            >
                <input {...getInputProps()} />
                {!file ? (
                    <>
                        <CloudUpload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">
                            {isDragActive ? "Drop your CV here" : "Drag and drop your CV here"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">or click to browse files</p>
                        <Button type="button" variant="outline" className="mt-4 bg-white/80">
                            Browse
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center justify-between bg-white/80 p-4 rounded-md border text-left">
                        <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-destructive mt-2 text-center">{error}</p>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
                Support PDF and DOCX files (max 10 MB)
            </p>
        </div>
    );
}