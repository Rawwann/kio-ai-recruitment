import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/users/github/status/ → Django /api/users/github/status/ (see users/urls.py)
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/github/status/" });
}
