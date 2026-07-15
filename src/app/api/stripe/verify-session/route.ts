import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

/**
 * GET /api/stripe/verify-session/?session_id=cs_xxx
 *
 * Called on the success redirect from Stripe.  Confirms the session is paid,
 * updates the subscription in the database, and returns the plan details.
 *
 * Returns: { plan, price_monthly, subscription_id, current_period_end }
 */
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/stripe/verify-session/" });
}
