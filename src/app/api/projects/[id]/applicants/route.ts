import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/projects/<id>/applicants/ → company views project applicants
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/${id}/applicants/` });
}
