"use client";

import { motion } from "framer-motion";
import {
    Building2,
    Globe,
    MapPin,
    Briefcase,
    Users,
    X,
    ChevronDown,
    CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Textarea } from "@/components/ui/forms/textarea";
import { Badge } from "@/components/ui/data-display/badge";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Button } from "@/components/ui/forms/button";
import { GeneralInfoTabProps } from "@/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/forms/form";
import { z } from "zod";
import { companyProfileSchema } from "@/lib/schemas";

// Sub-components
import { LogoUpload } from "@/components/features/company/LogoUpload";
import { LinkedInSyncDialog } from "@/components/features/company/LinkedInSyncDialog";

// Hook
import { useGeneralInfoTab } from "@/hooks/company/useGeneralInfoTab";

// Constants
import { COMPANY_SIZES, INDUSTRY_SUGGESTIONS } from "@/lib/constants/company/general-info-options";


export function GeneralInfoTab({
    data,
    loading,
    onSave,
    onCancel,
    onSyncSuccess,
    onChange,
    onLogoChange,
}: GeneralInfoTabProps) {
    const {
        form,
        linkedInForm,
        tags,
        logoPreview,
        size,
        tagInput,
        setTagInput,
        isSaving,
        sizeOpen,
        setSizeOpen,
        isLinkedInDialogOpen,
        setIsLinkedInDialogOpen,
        isSyncing,
        getRootProps,
        getInputProps,
        isDragActive,
        addTag,
        removeTag,
        onSubmit,
        handleSyncLinkedIn,
        handleCancel,
    } = useGeneralInfoTab({ data, onSave, onCancel, onSyncSuccess, onChange, onLogoChange });

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-32 w-48 rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                </div>
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col min-h-full relative"
            >
                {/* No full-form overlay — the LinkedIn dialog button shows its own spinner */}

                <div className="flex-1 space-y-8 p-6 pb-24">

                    {/* ── Logo Upload ─────────────────────────────── */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Company Logo</Label>
                        <div className="flex items-start gap-5">
                            <LogoUpload
                                logoPreview={logoPreview}
                                isDragActive={isDragActive}
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                onRemove={() => {
                                    form.setValue("logoUrl", "", { shouldValidate: true });
                                    if (onLogoChange) onLogoChange("");
                                }}
                                onError={() => {
                                    // If the URL is broken, clear it so we fall back to the upload box
                                    form.setValue("logoUrl", "", { shouldValidate: false });
                                    if (onLogoChange) onLogoChange("");
                                }}
                            />

                            {/* Sync with LinkedIn */}
                            <div className="flex flex-col gap-2 mt-2">
                                <LinkedInSyncDialog
                                    linkedInForm={linkedInForm}
                                    isSyncing={isSyncing}
                                    isOpen={isLinkedInDialogOpen}
                                    onOpenChange={setIsLinkedInDialogOpen}
                                    onSubmit={handleSyncLinkedIn}
                                />
                                <p className="text-xs text-gray-500 max-w-[180px]">
                                    Auto-import your logo and company info from LinkedIn.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* ── Form Fields ─────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Company Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: any }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Building2 className="size-3.5 text-purple-500" />
                                        Company Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Vodafone Intelligent Solutions"
                                            className="h-10 bg-purple-50/40 border-purple-100 focus:border-purple-400"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />

                        {/* Website */}
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }: { field: any }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Globe className="size-3.5 text-purple-500" />
                                        Website URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://www.company.com"
                                            className="h-10 bg-purple-50/40 border-purple-100 focus:border-purple-400"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />

                        {/* Location */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }: { field: any }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <MapPin className="size-3.5 text-purple-500" />
                                        Location / HQ
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Smart Village, Cairo"
                                            className="h-10 bg-purple-50/40 border-purple-100 focus:border-purple-400"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />

                        {/* Industry */}
                        <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }: { field: any }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Briefcase className="size-3.5 text-purple-500" />
                                        Industry
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Telecommunications / Tech"
                                            className="h-10 bg-purple-50/40 border-purple-100 focus:border-purple-400"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />

                        {/* Founded Year */}
                        <FormField
                            control={form.control}
                            name="foundedYear"
                            render={({ field }: { field: any }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <CalendarDays className="size-3.5 text-purple-500" />
                                        Founded Year
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="e.g., 2006"
                                            min={1800}
                                            max={new Date().getFullYear()}
                                            className="h-10 bg-purple-50/40 border-purple-100 focus:border-purple-400"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange({ target: { value: e.target.valueAsNumber || 0 } })
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />

                        {/* Company Size */}
                        <FormField
                            control={form.control}
                            name="size"
                            render={() => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Users className="size-3.5 text-purple-500" />
                                        Company Size
                                    </FormLabel>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setSizeOpen(!sizeOpen)}
                                            className="w-full h-10 flex items-center justify-between px-3 rounded-lg border border-purple-100 bg-purple-50/40 text-sm text-gray-700 hover:border-purple-400 transition-colors"
                                        >
                                            <span>{size} employees</span>
                                            <ChevronDown
                                                className={`size-4 text-gray-400 transition-transform ${sizeOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {sizeOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute z-20 top-full mt-1 w-full bg-white rounded-lg border border-gray-100 shadow-lg overflow-hidden"
                                            >
                                                {COMPANY_SIZES.map((s) => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => {
                                                            form.setValue("size", s, { shouldValidate: true });
                                                            setSizeOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-purple-50 transition-colors ${s === size ? "text-purple-600 font-medium bg-purple-50" : "text-gray-700"}`}
                                                    >
                                                        {s} employees
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                    <FormMessage className="" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* ── Industry Tags ────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="tags"
                        render={() => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-medium text-gray-700">Industry Tags</FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag: string) => (
                                                <motion.div
                                                    key={tag}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-0.5 hover:text-purple-900"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addTag(tagInput);
                                                    }
                                                }}
                                                placeholder="Add a tag and press Enter..."
                                                className="h-9 text-sm bg-purple-50/40 border-purple-100 flex-1"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {INDUSTRY_SUGGESTIONS.filter((s) => !tags.includes(s))
                                                .slice(0, 5)
                                                .map((sug) => (
                                                    <Badge
                                                        key={sug}
                                                        variant="outline"
                                                        onClick={() => addTag(sug)}
                                                        className="cursor-pointer text-xs border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
                                                    >
                                                        + {sug}
                                                    </Badge>
                                                ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />

                    {/* ── About ────────────────────────────────────── */}
                    <FormField
                        control={form.control}
                        name="about"
                        render={({ field }: { field: any }) => (
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-sm font-medium text-gray-700">About Company</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your company..."
                                        rows={5}
                                        className="bg-purple-50/40 border-purple-100 focus:border-purple-400 resize-none text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ── Sticky Footer ─────────────────────────────────── */}
                <div className="sticky bottom-0 z-10 flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-100">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="kio-btn-ai-primary h-10 px-6 font-semibold"
                    >
                        {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="h-10 px-5 text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}