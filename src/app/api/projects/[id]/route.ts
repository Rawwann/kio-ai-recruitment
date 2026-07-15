import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET    /api/projects/<id>/ → project details
// PUT    /api/projects/<id>/ → update project (company)
// DELETE /api/projects/<id>/ → delete project (company)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/${id}/` });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/${id}/` });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/${id}/` });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return proxyToDjango(req, { pathname: `/api/projects/${id}/` });
}
