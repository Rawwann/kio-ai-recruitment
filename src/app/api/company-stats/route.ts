import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET /api/company-stats/ → company dashboard KPI stats
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/company-stats/" });
}
