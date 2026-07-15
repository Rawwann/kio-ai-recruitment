import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// POST /api/users/github/disconnect/ → Django /api/users/github/disconnect/
export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/github/disconnect/" });
}
