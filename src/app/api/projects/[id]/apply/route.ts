import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/projects/<id>/apply/ → candidate applies to project
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const clean = id != null ? String(id).trim() : "";
    if (!clean || clean === "undefined" || clean === "NaN") {
        return NextResponse.json({ detail: "Missing or invalid project id." }, { status: 400 });
    }
    return proxyToDjango(req, { pathname: `/api/projects/${clean}/apply/` });
}
