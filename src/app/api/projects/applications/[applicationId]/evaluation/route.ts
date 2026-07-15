import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

export async function GET(
    req: NextRequest,
    ctx: { params: Promise<{ applicationId: string }> },
) {
    const { applicationId } = await ctx.params;
    return proxyToDjango(req, {
        pathname: `/api/projects/applications/${applicationId}/evaluation/`,
    });
}
