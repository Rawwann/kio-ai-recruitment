"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/overlays/dialog";
import Confetti from "@/components/vendors/magicui/confetti";

// ──────────────────────────────────────────────────────────────────
// ProjectSuccessDialog
// Owns: the success Dialog with Confetti, check icon, URL copy
//       input + button.
// ──────────────────────────────────────────────────────────────────
export function ProjectSuccessDialog({
    isDialogOpen,
    setIsDialogOpen,
    shareUrl,
    isCopied,
    handleCopy,
}: {
    isDialogOpen: boolean;
    setIsDialogOpen: (v: boolean) => void;
    shareUrl: string;
    isCopied: boolean;
    handleCopy: () => void;
}) {
    if (!(Dialog as any)) return null;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {isDialogOpen && (
                <Confetti className="fixed inset-0 z-[100] h-full w-full pointer-events-none" />
            )}
            {/* @ts-ignore */}
            <DialogContent
                className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800"
                asChild={false}
            >
                {/* @ts-ignore */}
                <DialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                        <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <DialogTitle className="text-center text-xl">Project Created Successfully!</DialogTitle>
                    <DialogDescription className="text-center text-slate-500 dark:text-slate-400 pt-2">
                        Your simulation environment is ready. Share this link with candidates.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <Input
                        readOnly
                        value={shareUrl}
                        className="border-0 bg-transparent py-0 h-auto focus-visible:ring-0 text-slate-500 font-mono text-sm"
                    />
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCopy}
                        className="ml-auto shrink-0 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition-colors"
                    >
                        {isCopied ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}