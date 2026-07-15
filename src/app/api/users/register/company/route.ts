import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/register/company/ → Django company registration
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/register/company/" });
}
