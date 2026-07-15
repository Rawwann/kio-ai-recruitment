import { AuthFormLoadingSkeleton } from "@/components/features/auth/AuthFormLoadingSkeleton";

export default function Loading() {
    return (
        <div className="w-full max-w-6xl px-4 py-10">
            <div className="mx-auto w-full max-w-md">
                <AuthFormLoadingSkeleton maxWidthClass="max-w-full" />
            </div>
        </div>
    );
}
