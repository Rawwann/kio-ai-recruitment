import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

export async function DELETE(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/workspace/delete/" });
}

export async function POST(req: NextRequest) {
    return proxyToDjango(req, { pathname: "/api/users/workspace/delete/" });
}
