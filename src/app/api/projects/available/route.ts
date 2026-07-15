import { NextRequest } from "next/server";
import { proxyToDjango } from "@/app/api/_proxy";

// Proxies to Django: GET http://127.0.0.1:8000/api/projects/available/
export async function GET(req: NextRequest) {
  return proxyToDjango(req, { pathname: "/api/projects/available/" });
}

