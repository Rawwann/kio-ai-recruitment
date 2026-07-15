import { Skeleton } from '@/components/ui/feedback/skeleton';
import { Card, CardContent } from '@/components/ui/layout/card';

export default function ApplicationsLoading() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-9 w-56 mb-2" />
                    <Skeleton className="h-4 w-80 max-w-full" />
                </div>
                <Skeleton className="h-10 w-full sm:w-64" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-8 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <Card>
                <CardContent className="p-0">
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
