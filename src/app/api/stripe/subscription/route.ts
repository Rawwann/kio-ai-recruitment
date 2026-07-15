import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

/** GET /api/stripe/subscription/ — current subscription status for authed company. */
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/stripe/subscription/" });
}
