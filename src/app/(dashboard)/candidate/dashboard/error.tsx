'use client';

import { useEffect } from 'react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container mx-auto py-6 text-center">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
            <p className="mt-2 text-muted-foreground">{error.message}</p>
            <button
                onClick={() => reset()}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Try again
            </button>
        </div>
    );
}