import { Skeleton } from '@/components/ui/feedback/skeleton';

export default function CandidateProjectDetailLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <Skeleton className="h-7 w-40 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-64" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-7 w-24 rounded-full" />
                            <Skeleton className="h-7 w-28 rounded-full" />
                        </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm space-y-3">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[85%]" />
                        </div>
                    ))}
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="rounded-2xl h-80 w-full" />
                </div>
            </div>
        </div>
    );
}
