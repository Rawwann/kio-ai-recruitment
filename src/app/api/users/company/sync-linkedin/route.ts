import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/company/sync-linkedin/
// Proxies to Django's CompanyLinkedInSyncView mock scraper.
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/company/sync-linkedin/" });
}
