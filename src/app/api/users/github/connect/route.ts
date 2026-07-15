import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/github/connect/
// Exchanges GitHub OAuth `code` (JSON body) with Django.
// → Django /api/users/github/callback/
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/github/connect/" });
}
