import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET  /api/projects/ → company's own projects list
// POST /api/projects/ → create a new project
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/projects/" });
}

export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/projects/" });
}
