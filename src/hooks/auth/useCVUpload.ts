import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CV_MAX_SIZE, CV_ACCEPT_TYPES } from "@/lib/constants/auth/dropzone-config";

/**
 * Manages the CV drop-zone UI state.
 * The file is surfaced via onFileUploaded(file) so the caller owns the
 * authoritative copy — no cross-hook state sharing needed.
 */
export function useCVUpload(onFileUploaded?: (file: File) => void) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: any[]) => {
            if (fileRejections.length > 0) {
                const code = fileRejections[0]?.errors[0]?.code;
                if (code === "file-too-large") {
                    setError("File is too large. Maximum size is 10 MB.");
                } else if (code === "file-invalid-type") {
                    setError("Invalid file type. Only PDF and DOCX are allowed.");
                } else {
                    setError("An error occurred while uploading the file.");
                }
                return;
            }

            const selected = acceptedFiles[0];
            if (selected) {
                setFile(selected);
                setError(null);
                onFileUploaded?.(selected);
            }
        },
        [onFileUploaded],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: CV_ACCEPT_TYPES,
        maxSize: CV_MAX_SIZE,
        multiple: false,
    });

    const removeFile = useCallback(() => setFile(null), []);

    return { file, error, getRootProps, getInputProps, isDragActive, removeFile };
}
