import { Card, CardContent } from "@/components/ui/layout/card";
import { Badge } from "@/components/ui/data-display/badge";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Activity, Users, CheckCircle, AlertCircle } from "lucide-react";

const fmt = (n: number) => n.toLocaleString();

export function KPIStats({
    activeCampaigns,
    totalApplicants,
    simulationsPassed,
    needsReview,
    loading,
}: {
    activeCampaigns: number;
    totalApplicants: number;
    simulationsPassed: number;
    needsReview: number;
    loading: boolean;
}) {
    const cards = [
        {
            title: "Active Campaigns",
            value: fmt(activeCampaigns),
            label: "Active",
            icon: Activity,
            color: "border-purple-100 bg-gradient-to-br from-purple-50 to-white",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            badgeClass: "bg-purple-100 text-purple-700",
        },
        {
            title: "Total Applicants",
            value: fmt(totalApplicants),
            label: "Total",
            icon: Users,
            color: "border-purple-100 bg-gradient-to-br from-purple-50 to-white",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            badgeClass: "bg-purple-100 text-purple-700",
        },
        {
            title: "Simulations Passed",
            value: fmt(simulationsPassed),
            label: "Success",
            icon: CheckCircle,
            color: "border-purple-100 bg-gradient-to-br from-purple-50 to-white",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            badgeClass: "bg-green-100 text-green-700",
        },
        {
            title: "Needs Review",
            value: fmt(needsReview),
            label: "Urgent",
            icon: AlertCircle,
            color: "border-none shadow-lg bg-gradient-to-br from-purple-800 via-violet-600 to-[#d97706] text-white",
            iconBg: "bg-white/20",
            iconColor: "text-white",
            badgeClass: "bg-white/20 text-white border-none",
            isSpecial: true
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((stat, i) => (
                <Card
                    key={i}
                    className={`rounded-2xl transition-all duration-300 hover:shadow-md ${stat.color} ${stat.isSpecial ? 'hover:scale-105' : 'hover:scale-[102%]'}`}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                            </div>
                            <Badge variant="secondary" className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${stat.badgeClass}`}>
                                {stat.label}
                            </Badge>
                        </div>
                        <div>
                            <p className={`text-3xl font-bold mb-1 ${stat.isSpecial ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium ${stat.isSpecial ? 'text-white/80' : 'text-gray-500'}`}>
                                {stat.title}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}