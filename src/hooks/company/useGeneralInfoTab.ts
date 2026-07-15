import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { companyProfileSchema, linkedInSyncSchema } from "@/lib/schemas";
import { CompanyProfile, CompanySize, GeneralInfoTabProps } from "@/types";

function readBlobAsDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(reader.error ?? new Error("Failed to read image"));
        reader.readAsDataURL(blob);
    });
}

async function fileToPersistentLogoUrl(file: File): Promise<string> {
    try {
        const bitmap = await createImageBitmap(file);
        const maxSide = 512;
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is unavailable");

        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, "image/webp", 0.88);
        });

        if (blob) return readBlobAsDataUrl(blob);
    } catch {
        // Fall back to the original image if browser decoding/compression fails.
    }

    return readBlobAsDataUrl(file);
}

// ──────────────────────────────────────────────────────────────────
// useGeneralInfoTab
// Owns: both useForm instances, all useState, useEffect subscription,
//       onDrop callback, all handlers (addTag, removeTag, onSubmit,
//       handleSyncLinkedIn). Returns everything the UI needs.
// ──────────────────────────────────────────────────────────────────
export function useGeneralInfoTab({
    data,
    onSave,
    onCancel,
    onSyncSuccess,
    onChange,
    onLogoChange,
}: Pick<
    GeneralInfoTabProps,
    "data" | "onSave" | "onCancel" | "onSyncSuccess" | "onChange" | "onLogoChange"
>) {
    // ── Main profile form ─────────────────────────────────────────
    const form = useForm({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: {
            name: data?.name || "",
            website: data?.website || "",
            location: data?.location || "",
            industry: data?.industry || "",
            size: data?.size || "1-10",
            foundedYear: data?.foundedYear || new Date().getFullYear(),
            about: data?.about || "",
            tags: data?.tags || [],
            logoUrl: data?.logoUrl || "",
        },
    }) as any;

    const tags = form.watch("tags");
    const logoPreview = form.watch("logoUrl");
    const size = form.watch("size");

    // Form pre-population is handled by the parent mounting this hook with a
    // key that changes when loading finishes (see GeneralInfoTab / CompanyProfilePage).
    // That causes a clean re-mount with the correct defaultValues — no useEffect
    // needed and no circular-state loop between form.watch → onChange → data prop.

    // Propagate every form keystroke to parent's localData (never touches context)
    useEffect(() => {
        const subscription = form.watch((value: any) => {
            if (onChange) {
                onChange(value as Partial<CompanyProfile>);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, onChange]);

    // ── Local UI state ────────────────────────────────────────────
    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [sizeOpen, setSizeOpen] = useState(false);
    const [isLinkedInDialogOpen, setIsLinkedInDialogOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    // Ref mirror of isSyncing — avoids stale-closure issues inside onSubmit
    const isSyncingRef = useRef(false);

    // ── LinkedIn sync form ────────────────────────────────────────
    const linkedInForm = useForm({
        resolver: zodResolver(linkedInSyncSchema),
        defaultValues: {
            url: "",
        },
    }) as any;

    // Logo upload stores a durable data URL, not a tab-scoped blob URL.
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            try {
                const logoUrl = await fileToPersistentLogoUrl(file);
                form.setValue("logoUrl", logoUrl, { shouldValidate: true });
                if (onLogoChange) onLogoChange(logoUrl);
            } catch {
                toast.error("Logo upload failed", {
                    description: "Please try another JPG or PNG image.",
                });
            }
        },
        [form, onLogoChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [] },
        maxSize: 5 * 1024 * 1024,
    });

    // ── Tag handlers ──────────────────────────────────────────────
    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            form.setValue("tags", [...tags, trimmed], { shouldValidate: true });
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        form.setValue("tags", tags.filter((t: string) => t !== tag), { shouldValidate: true });
    };

    // ── Form submit ───────────────────────────────────────────────
    // Guard: if a LinkedIn sync is in progress, swallow any accidental
    // submit events (e.g. from inner form submit bubbling through the DOM).
    const onSubmit = async (values: z.infer<typeof companyProfileSchema>) => {
        if (isSyncingRef.current) return;
        setIsSaving(true);
        try {
            await onSave({
                ...values,
                size: values.size as CompanySize,
                logoUrl: form.getValues("logoUrl"),
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ── LinkedIn sync handler ─────────────────────────────────────
    const handleSyncLinkedIn = async (values: z.infer<typeof linkedInSyncSchema>) => {
        isSyncingRef.current = true;
        setIsSyncing(true);

        try {
            const res = await fetch("/api/users/company/sync-linkedin/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ linkedin_url: values.url }),
            });

            if (!res.ok) {
                // Attempt to surface the actual server error message.
                let serverMessage = "Please try again.";
                try {
                    const errBody = await res.json();
                    serverMessage =
                        errBody?.detail ??
                        errBody?.message ??
                        errBody?.error ??
                        (res.status === 401 ? "Session expired — please log in again." : `Server error ${res.status}.`);
                } catch {
                    if (res.status === 401) serverMessage = "Session expired — please log in again.";
                    else serverMessage = `Server error ${res.status}.`;
                }
                console.error("[handleSyncLinkedIn] non-OK response:", res.status, serverMessage);
                toast.error(`Import failed: ${serverMessage}`);
                return;
            }

            const raw = await res.json();

            // Build a map of ONLY the fields the API actually returned.
            // We deliberately omit any ?? fallback so that a null/undefined
            // field in the response leaves the existing form value untouched.
            const fieldMap: Record<string, unknown> = {};
            if (raw.name != null) fieldMap.name = raw.name;
            if (raw.website != null) fieldMap.website = raw.website;
            if (raw.location != null) fieldMap.location = raw.location;
            if (raw.industry != null) fieldMap.industry = raw.industry;
            if (raw.founded_year != null) fieldMap.foundedYear = raw.founded_year;
            if (raw.size != null) fieldMap.size = raw.size;
            if (raw.about != null) fieldMap.about = raw.about;
            if (raw.tags != null) fieldMap.tags = Array.isArray(raw.tags) ? raw.tags : [];
            if (raw.logo_url != null) fieldMap.logoUrl = raw.logo_url;

            // 1. Push only the API-returned fields into the form — nothing else.
            Object.entries(fieldMap).forEach(([key, value]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form.setValue(key as any, value as any, { shouldValidate: true });
            });

            // 2. Stage logo preview in parent if the API returned one.
            if (fieldMap.logoUrl && onLogoChange) {
                onLogoChange(fieldMap.logoUrl as string);
            }

            // 3. Propagate non-logo fields to parent's localData.
            const { logoUrl: _logo, ...rest } = fieldMap;
            if (onSyncSuccess) {
                onSyncSuccess(rest as Partial<CompanyProfile>);
            }

            // 4. Exactly ONE success toast — no other toast fires during sync
            //    because isSyncingRef.current blocks onSubmit / handleUpdateProfile.
            toast.success("Company data imported successfully", {
                description: 'Review the changes, then click "Save Profile" to apply.',
            });
        } catch (err) {
            console.error("[handleSyncLinkedIn] unexpected error:", err);
            const msg = err instanceof Error ? err.message : "Network error — is Django running?";
            toast.error(`Import failed: ${msg}`);
        } finally {
            isSyncingRef.current = false;
            setIsSyncing(false);
            setIsLinkedInDialogOpen(false);
            linkedInForm.reset();
        }
    };

    // ── Cancel handler ────────────────────────────────────────────
    const handleCancel = () => {
        form.reset();
        onCancel();
    };

    return {
        // Form instances
        form,
        linkedInForm,
        // Watched values
        tags,
        logoPreview,
        size,
        // Local UI state
        tagInput,
        setTagInput,
        isSaving,
        sizeOpen,
        setSizeOpen,
        isLinkedInDialogOpen,
        setIsLinkedInDialogOpen,
        isSyncing,
        // Dropzone
        getRootProps,
        getInputProps,
        isDragActive,
        // Handlers
        addTag,
        removeTag,
        onSubmit,
        handleSyncLinkedIn,
        handleCancel,
    };
}
