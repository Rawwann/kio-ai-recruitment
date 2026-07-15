import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

function buildTargetUrl(pathname: string, searchParams: URLSearchParams) {
    const base = DJANGO_BASE_URL.replace(/\/+$/, "");
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const url = new URL(`${base}${path}`);
    searchParams.forEach((value, key) => url.searchParams.set(key, value));
    return url;
}

async function safeReadJson(res: Response) {
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) return null;
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export async function proxyToDjango(req: NextRequest, opts: { pathname: string }) {
    const targetUrl = buildTargetUrl(opts.pathname, req.nextUrl.searchParams);

    // ── Resolve the Bearer token from the NextAuth session ───────────────────
    // Route handlers run on the server; the JWT token lives in the encrypted
    // NextAuth session cookie, not in an Authorization header sent by the browser.
    // We read it here and inject it so Django can authenticate the request.
    const session = await getServerSession(authOptions);
    const accessToken = (session as any)?.accessToken as string | undefined;

    // ── Build a clean outgoing header set ────────────────────────────────────
    // We only forward headers that are safe / meaningful for a Django API call.
    // Critically we do NOT forward:
    //   - host      (would confuse Django's ALLOWED_HOSTS)
    //   - cookie    (contains the NextAuth session cookie — must never leave Next.js)
    //   - accept-encoding (Next.js may have already decompressed the body)
    const forwardHeaders = new Headers();

    const allowList = ["content-type", "accept", "x-request-id"];
    for (const key of allowList) {
        const value = req.headers.get(key);
        if (value) forwardHeaders.set(key, value);
    }

    if (accessToken) {
        forwardHeaders.set("Authorization", `Bearer ${accessToken}`);
    }

    const init: RequestInit = {
        method: req.method,
        headers: forwardHeaders,
        cache: "no-store",
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
        init.body = await req.text();
    }

    const res = await fetch(targetUrl, init);

    const json = await safeReadJson(res);
    if (json !== null) {
        return NextResponse.json(json, { status: res.status });
    }

    const text = await res.text();

    // 204 No Content — must return empty response with no body
    if (res.status === 204) {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "content-type": res.headers.get("content-type") ?? "text/plain; charset=utf-8",
            },
        });
    }

    return new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "text/plain; charset=utf-8",
        },
    });
}
