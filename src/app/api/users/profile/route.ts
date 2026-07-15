import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET  /api/users/profile/ → fetch current user profile (company or candidate)
// PUT  /api/users/profile/ → update current user profile
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/profile/" });
}

export async function PUT(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/profile/" });
}

export async function PATCH(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/profile/" });
}
