import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/register/ → Django candidate registration
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/register/candidate/" });
}
