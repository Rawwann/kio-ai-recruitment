import { Skeleton } from '@/components/ui/feedback/skeleton';
import { Card, CardContent } from '@/components/ui/layout/card';

export default function CandidateProfileLoading() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-full max-w-md mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="pt-6">
                            <Skeleton className="h-10 w-full mb-6" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-40" />
                                <div className="w-full space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
