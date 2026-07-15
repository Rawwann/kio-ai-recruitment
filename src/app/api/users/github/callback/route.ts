import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

/**
 * POST /api/users/github/callback/
 * Same Django target as /api/users/github/connect/ — explicit alias for OAuth code exchange.
 * → Django http://127.0.0.1:8000/api/users/github/callback/ (or DJANGO_BASE_URL)
 */
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/github/callback/" });
}
