import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const CANDIDATE_ROOT = "/candidate";
const COMPANY_ROOT   = "/company";

const PUBLIC_PATHS = ["/login", "/signup", "/reset-password", "/auth"] as const;

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Never treat marketing/auth pages as protected (if matcher is expanded later)
    if (
        PUBLIC_PATHS.some(
            (base) => pathname === base || pathname.startsWith(`${base}/`),
        )
    ) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuth = !!token;

    // ── Redirect unauthenticated users to /login ──────────────────────────────
    if (!isAuth) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    const role = token.user_type; // "COMPANY" | "CANDIDATE" | null

    // ── RBAC: block CANDIDATE from /company/* ─────────────────────────────────
    if (role === "CANDIDATE" && pathname.startsWith(COMPANY_ROOT)) {
        return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }

    // ── RBAC: block COMPANY from /candidate/* ─────────────────────────────────
    if (role === "COMPANY" && pathname.startsWith(CANDIDATE_ROOT)) {
        return NextResponse.redirect(new URL("/company/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/candidate/:path*",
        "/company/:path*",
    ],
};
