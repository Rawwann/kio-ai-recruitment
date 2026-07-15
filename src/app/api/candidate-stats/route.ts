import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/candidate-stats/ → proxies to Django /api/projects/candidate-stats/
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/projects/candidate-stats/" });
}
