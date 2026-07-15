import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { MessageCircle } from "lucide-react";
import { HeaderActions } from "./HeaderActions";

/**
 * In-app team chat is not part of the recruitment API. Card shows placeholder until
 * a collaboration feed exists server-side.
 */
export function TeamCollaborationCard() {
    return (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    Team Collaboration
                </CardTitle>
                <HeaderActions />
            </CardHeader>
            <CardContent className="flex-1 p-6 text-center text-sm text-slate-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Connect internal messaging to see recruiter threads here.
            </CardContent>
        </Card>
    );
}
