import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

/**
 * POST /api/stripe/create-checkout-session
 *
 * Body: { plan: "Starter" | "Growth" | "Enterprise" }
 *
 * Returns: { url: string | null }
 *   url — Stripe-hosted checkout URL to redirect the browser to.
 *   null — Stripe not yet configured; client falls back to dev simulation.
 */
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/stripe/create-checkout-session/" });
}
