import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET    /api/projects/my-applications/<pk>/ → application detail
// PATCH  /api/projects/my-applications/<pk>/ → update repo_url
// DELETE /api/projects/my-applications/<pk>/ → withdraw application
export async function GET(req: NextRequest, { params }: { params: Promise<{ pk: string }> }) {
    const { pk } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/my-applications/${pk}/` });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pk: string }> }) {
    const { pk } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/my-applications/${pk}/` });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ pk: string }> }) {
    const { pk } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/my-applications/${pk}/` });
}
