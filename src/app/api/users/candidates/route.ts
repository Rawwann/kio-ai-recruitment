import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/users/candidates/ → list all candidates (for company view)
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/candidates/" });
}
