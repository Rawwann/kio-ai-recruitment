import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/token/refresh/ → Django SimpleJWT (CustomTokenRefreshView)
// Canonical path is /api/users/login/refresh/ (see users.urls); root /api/token/refresh/ also exists.
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/login/refresh/" });
}
