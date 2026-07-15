import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// PATCH /api/projects/applications/<id>/update-status/ → company updates application status
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ applicationId: string }> },
) {
    const { applicationId } = await params;
    return proxyToDjango(req, {
        pathname: `/api/projects/applications/${applicationId}/update-status/`,
    });
}
