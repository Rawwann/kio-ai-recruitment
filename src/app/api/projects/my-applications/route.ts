import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// GET    /api/projects/my-applications/        → list candidate's applications
export async function GET(req: NextRequest) {
    return proxyToDjango(req, { pathname: `/api/projects/my-applications/` });
}
