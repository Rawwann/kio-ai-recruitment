
'use client';

export default function ProjectsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="container mx-auto py-6 text-center">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
            <p className="mt-2">{error.message}</p>
            <button
                onClick={() => reset()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Try again
            </button>
        </div>
    );
}