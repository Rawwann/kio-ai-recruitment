import { LiveFeedProps } from "@/types";
import { HiringFunnelCard } from "@/components/features/dashboard/HiringFunnelCard";
import { TopPerformersCard } from "@/components/features/dashboard/TopPerformersCard";
import { RecruitmentAlertsCard } from "@/components/features/dashboard/RecruitmentAlertsCard";
import { TeamCollaborationCard } from "@/components/features/dashboard/TeamCollaborationCard";

export function LiveFeed({
    funnelPeriod,
    setFunnelPeriod,
    alertsSort,
    setAlertsSort,
    funnel,
    topPerformers,
    alerts,
}: LiveFeedProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HiringFunnelCard
                    funnelPeriod={funnelPeriod}
                    setFunnelPeriod={setFunnelPeriod}
                    stages={funnel}
                />
                <TopPerformersCard performers={topPerformers} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecruitmentAlertsCard alertsSort={alertsSort} setAlertsSort={setAlertsSort} items={alerts} />
                <TeamCollaborationCard />
            </div>
        </div>
    );
}
