import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * POST /api/users/upload-cv/
 *
 * Binary-safe proxy for multipart/form-data CV uploads.
 * We cannot use the shared proxyToDjango helper here because it reads the
 * body with req.text(), which corrupts binary file content.
 * Instead we forward the raw ArrayBuffer and preserve the original
 * Content-Type header (which includes the multipart boundary that Django
 * needs to parse the file correctly).
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken as string | undefined;

    if (!accessToken) {
        return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
    }

    // Read the raw body as an ArrayBuffer to preserve binary file data
    const body = await req.arrayBuffer();

    // The Content-Type header carries the multipart boundary —
    // Django's MultiPartParser needs this to split the fields from the file.
    const contentType = req.headers.get("content-type") ?? "";

    const headers = new Headers();
    if (contentType) headers.set("content-type", contentType);
    headers.set("authorization", `Bearer ${accessToken}`);

    let djangoRes: Response;
    try {
        djangoRes = await fetch(`${DJANGO_BASE_URL}/api/users/upload-cv/`, {
            method: "POST",
            headers,
            body,
        });
    } catch (err) {
        console.error("[upload-cv proxy] network error:", err);
        return NextResponse.json(
            { detail: "Could not reach Django — is the server running?" },
            { status: 502 },
        );
    }

    const contentTypeRes = djangoRes.headers.get("content-type") ?? "";
    if (contentTypeRes.includes("application/json")) {
        const json = await djangoRes.json();
        return NextResponse.json(json, { status: djangoRes.status });
    }

    const text = await djangoRes.text();
    return new NextResponse(text, {
        status: djangoRes.status,
        headers: { "content-type": "text/plain; charset=utf-8" },
    });
}
