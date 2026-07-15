'use client';

import { AlertCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/forms/button';

interface GitHubWarningBannerProps {
    onConnect: () => void;
}

export function GitHubWarningBanner({ onConnect }: GitHubWarningBannerProps) {
    return (
        <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm text-blue-900 mb-3">
                    Connect your GitHub account to analyze your private repositories and boost your profile strength to 100%.
                </p>
                <Button
                    onClick={onConnect}
                    className="kio-btn-ai-primary"
                    size="sm"
                >
                    <Github className="mr-2 h-4 w-4" />
                    Connect GitHub
                </Button>
            </div>
        </div>
    );
}
