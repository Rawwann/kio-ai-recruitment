"use client";

import { Upload, X } from "lucide-react";

// ──────────────────────────────────────────────────────────────────
// LogoUpload
// Owns: the logo upload box UI (empty state) and the image preview
//       UI (filled state). All logic (onDrop, onRemove) is passed
//       in via props from useGeneralInfoTab.
// ──────────────────────────────────────────────────────────────────
export function LogoUpload({
    logoPreview,
    isDragActive,
    getRootProps,
    getInputProps,
    onRemove,
    onError,
}: {
    logoPreview: string;
    isDragActive: boolean;
    getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
    getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
    onRemove: () => void;
    onError: () => void;
}) {
    // STRICT RULE: only render <img> when logoPreview is a non-empty string
    if (!logoPreview || logoPreview.trim() === "") {
        // ═════ EMPTY STATE: Upload Box ═════
        return (
            <div
                {...getRootProps()}
                className={`w-40 h-40 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2
                    border-2 border-dashed transition-all duration-200 select-none
                    ${isDragActive
                        ? "border-purple-500 bg-purple-50 scale-[1.02]"
                        : "border-slate-200 bg-slate-50 hover:border-purple-400 hover:bg-purple-50/60"
                    }`}
            >
                <input {...getInputProps()} />
                {/* Purple icon circle */}
                <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                    <Upload className="size-5 text-purple-600" />
                </div>
                <p className="text-xs font-semibold text-gray-600">
                    {isDragActive ? "Drop it here!" : "Upload Logo"}
                </p>
                <p className="text-[10px] text-slate-400 text-center leading-relaxed px-2">
                    Drag & drop or click<br />JPG / PNG · max 5 MB
                </p>
            </div>
        );
    }

    // ═════ FILLED STATE: Image Preview ═════
    return (
        <div className="relative w-40 h-40 rounded-xl border-2 border-gray-200 bg-white overflow-hidden group">
            {/* Hidden dropzone input so clicking the preview also allows re-upload */}
            <div {...getRootProps()} className="absolute inset-0 cursor-pointer">
                <input {...getInputProps()} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={logoPreview}
                alt="Company logo"
                className="w-full h-full object-contain p-2"
                onError={onError}
            />
            {/* X — Remove button (top-right corner) */}
            <button
                type="button"
                aria-label="Remove logo"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:border-red-200"
            >
                <X className="size-3 text-gray-500 hover:text-red-500" />
            </button>
        </div>
    );
}