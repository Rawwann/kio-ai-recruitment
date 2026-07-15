import { cn } from "@/lib/utils";

type AuthFormLoadingSkeletonProps = {
    className?: string;
    /** Width cap for the skeleton block (login asks for max-w-[400px]) */
    maxWidthClass?: string;
};

const pulseField = "animate-pulse rounded-md bg-muted/50";
const pulseButton = "animate-pulse rounded-md bg-muted/70";

/**
 * Minimal placeholder that mirrors email / password / primary CTA spacing.
 * Parent should supply the same outer width wrapper as the real page for less jump on paint.
 */
export function AuthFormLoadingSkeleton({
    className,
    maxWidthClass = "max-w-[400px]",
}: AuthFormLoadingSkeletonProps) {
    return (
        <div className={cn("w-full", maxWidthClass, className)}>
            <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                    <div
                        className={cn("size-12 shrink-0 rounded-full", pulseField)}
                        aria-hidden
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <div className={cn("h-10 w-full", pulseField)} aria-hidden />
                    <div className={cn("h-10 w-full", pulseField)} aria-hidden />
                </div>
                <div className={cn("h-10 w-full", pulseButton)} aria-hidden />
            </div>
        </div>
    );
}
