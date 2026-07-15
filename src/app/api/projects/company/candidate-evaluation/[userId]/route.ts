import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

export async function GET(
    req: NextRequest,
    ctx: { params: Promise<{ userId: string }> },
) {
    const { userId } = await ctx.params;
    return proxyToDjango(req, {
        pathname: `/api/projects/company/candidate-evaluation/${userId}/`,
    });
}
