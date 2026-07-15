import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

/** GET /api/users/company/search?q= — company typeahead (proxies to Django). */
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/company/search/" });
}
