"use client";

import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import ShimmerButton from "@/components/vendors/magicui/shimmer-button";
import { Link2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/overlays/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/forms/form";
import { linkedInSyncSchema } from "@/lib/schemas";

// ──────────────────────────────────────────────────────────────────
// LinkedInSyncDialog
// Owns: the Dialog + ShimmerButton trigger + inner LinkedIn form UI.
// All logic (isSyncing, onSubmit, isOpen, onOpenChange) is passed
// in via props from useGeneralInfoTab.
// ──────────────────────────────────────────────────────────────────
export function LinkedInSyncDialog({
    linkedInForm,
    isSyncing,
    isOpen,
    onOpenChange,
    onSubmit,
}: {
    linkedInForm: any;
    isSyncing: boolean;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof linkedInSyncSchema>) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <div
                    className="inline-block"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpenChange(true);
                    }}
                >
                    <ShimmerButton
                        type="button"
                        shimmerColor="#c084fc"
                        background="#a855f7"
                        borderRadius="8px"
                        className="px-4 py-2 text-sm font-medium gap-2"
                    >
                        <Link2 className="size-4" />
                        Sync with LinkedIn
                    </ShimmerButton>
                </div>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader className="">
                    <DialogTitle className="">Sync Company Data</DialogTitle>
                </DialogHeader>
                <Form {...linkedInForm}>
                    <form
                        onSubmit={linkedInForm.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        <div className="space-y-2">
                            <FormField
                                control={linkedInForm.control}
                                name="url"
                                render={({ field }: { field: any }) => (
                                    <FormItem className="">
                                        <FormLabel className="">LinkedIn Company URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://www.linkedin.com/company/..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className=""
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSyncing}
                                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
                            >
                                {isSyncing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Syncing...
                                    </span>
                                ) : (
                                    "Sync Now"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}