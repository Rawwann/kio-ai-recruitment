import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/my-applications/ → proxies to Django /api/projects/my-applications/
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/projects/my-applications/" });
}
