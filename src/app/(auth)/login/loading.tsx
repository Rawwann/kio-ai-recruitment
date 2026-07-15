import { AuthFormLoadingSkeleton } from "@/components/features/auth/AuthFormLoadingSkeleton";

export default function Loading() {
    return (
        <div className="w-full max-w-sm md:max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 md:p-8">
                    <AuthFormLoadingSkeleton maxWidthClass="max-w-[400px] md:max-w-full" />
                </div>
                <div className="hidden md:block min-h-[280px] bg-transparent" aria-hidden />
            </div>
        </div>
    );
}
