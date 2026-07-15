import { Card } from '@/components/ui/layout/card';
import { Button } from '@/components/ui/forms/button';
import type { ActiveSimulation } from '@/types/candidate';

interface ActiveSimulationsListProps {
    simulations: ActiveSimulation[];
}

export function ActiveSimulationsList({ simulations }: ActiveSimulationsListProps) {
    return (
        <div className="space-y-4">
            {simulations.map((sim) => (
                <Card key={sim.id} className="p-4">
                    <div className="flex flex-col space-y-2">
                        {/* Time remaining or deadline */}
                        <div className="text-sm text-muted-foreground">
                            {sim.timeRemaining ? (
                                <span>Time Remaining: {sim.timeRemaining}</span>
                            ) : sim.deadline ? (
                                <span>Deadline: {sim.deadline}</span>
                            ) : null}
                        </div>
                        {/* Title */}
                        <h3 className="text-lg font-semibold">{sim.title}</h3>
                        {/* Description */}
                        <p className="text-sm text-muted-foreground">{sim.description}</p>
                        {/* Button */}
                        <div className="pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(sim.githubRepoUrl, '_blank')}
                            >
                                Open GitHub Repo
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}