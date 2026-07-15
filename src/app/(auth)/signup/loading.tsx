import { AuthFormLoadingSkeleton } from "@/components/features/auth/AuthFormLoadingSkeleton";

export default function Loading() {
    return (
        <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 min-h-[600px]">
            <div className="flex flex-col justify-center p-8 md:p-12">
                <AuthFormLoadingSkeleton maxWidthClass="max-w-[400px] md:max-w-full" />
            </div>
            <div
                className="hidden md:block min-h-[320px] bg-transparent"
                aria-hidden
            />
        </div>
    );
}
