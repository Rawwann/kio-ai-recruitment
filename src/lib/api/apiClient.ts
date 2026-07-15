/**
 * Shared API client for all service calls.
 *
 * Usage (client component / hook):
 *   import { apiFetch } from '@/lib/api/apiClient';
 *   const data = await apiFetch('/api/candidate-stats/');
 *
 * The helper:
 *  1. Reads the NextAuth session token (via getSession on client, or by
 *     accepting an explicit token for server-side calls).
 *  2. Attaches Authorization: Bearer <accessToken>.
 *  3. On 401 Unauthorized: attempts one token refresh (Django refresh JWT), then
 *     signOut() + /login if refresh fails or an explicit accessToken was used
 *     (skipped on /login, /signup, and other public routes to avoid redirect loops).
 *  4. Throws a typed ApiError on other non-2xx responses so callers can
 *     catch and display meaningful toast messages.
 */

import { getSession, signIn, signOut } from 'next-auth/react';
import { navPush } from '@/lib/navigation-bridge';

/** Routes where an unauthenticated 401 must not run signOut + /login (avoids redirect loops on public pages). */
function isPublicOrAuthPath(): boolean {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname;
    if (p === '/') return true;
    const prefixFree = [
        '/login',
        '/signup',
        '/reset-password',
        '/terms-and-conditions',
        '/privacy-policy',
        '/auth',
    ] as const;
    return prefixFree.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

// ─── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public body?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/** Flattens Django/DRF validation JSON into a single human-readable line. */
export function formatDjangoErrorBody(body: unknown): string {
    if (body == null || typeof body === 'boolean') return 'Request failed';
    if (typeof body === 'string') return body.trim() || 'Request failed';
    if (Array.isArray(body)) return body.map((x) => String(x)).join(' ');

    const o = body as Record<string, unknown>;
    if (typeof o.detail === 'string' && o.detail.trim()) return o.detail.trim();
    if (Array.isArray(o.detail)) return o.detail.map((x) => String(x)).join(' ');

    const parts: string[] = [];
    for (const [key, val] of Object.entries(o)) {
        if (key === 'detail') continue;
        if (Array.isArray(val)) {
            const s = val.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' ');
            parts.push(`${key}: ${s}`);
        } else if (val !== null && typeof val === 'object') {
            parts.push(`${key}: ${formatDjangoErrorBody(val)}`);
        } else {
            parts.push(`${key}: ${String(val)}`);
        }
    }
    return parts.length > 0 ? parts.join(' · ') : 'Request failed';
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
    /** Pass an explicit access token (e.g. from server-side getServerSession). */
    accessToken?: string;
    /** JSON-serialisable body (will be stringified & Content-Type set). */
    body?: unknown;
}

export async function apiFetch<T = unknown>(
    url: string,
    { accessToken, body, headers: extraHeaders, ...rest }: ApiFetchOptions = {},
    /** Internal: avoid infinite loops when refresh succeeds but replay still fails */
    _didAttemptRefresh = false,
): Promise<T> {
    // Resolve token: prefer explicit token, then read from client session.
    let token = accessToken;
    if (!token) {
        const session = await getSession();
        token = session?.accessToken as string | undefined;
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(extraHeaders as Record<string, string> | undefined),
    };

    const init: RequestInit = {
        cache: 'no-store',
        ...rest,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, init);

    // ── 401: try one silent refresh, then logout ─────────────────────────────
    if (res.status === 401 && isPublicOrAuthPath()) {
        throw new ApiError(401, 'Unauthorized');
    }

    if (res.status === 401 && !_didAttemptRefresh && !accessToken) {
        const session = await getSession();
        const refresh = session?.refreshToken;
        if (refresh) {
            try {
                const rr = await fetch('/api/users/token/refresh/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh }),
                });
                if (rr.ok) {
                    const data = (await rr.json()) as { token?: string };
                    const newAccess = data.token;
                    if (newAccess) {
                        // Re-hydrate NextAuth session JWT via social bridge (validates token against /profile/).
                        await signIn('social', {
                            accessToken: newAccess,
                            refreshToken: refresh,
                            redirect: false,
                        });
                        return apiFetch<T>(url, { body, headers: extraHeaders, ...rest }, true);
                    }
                }
            } catch {
                /* fall through to logout */
            }
        }
        await signOut({ redirect: false });
        navPush('/login');
        throw new ApiError(401, 'Session expired. Please log in again.');
    }

    if (res.status === 401) {
        await signOut({ redirect: false });
        navPush('/login');
        throw new ApiError(401, 'Session expired. Please log in again.');
    }

    // BUG-4.3: 204 No Content has no body — return specific object for DELETE to avoid falsy issues.
    if (res.status === 204) {
        if (init.method?.toUpperCase() === 'DELETE') {
            return { success: true } as T;
        }
        return undefined as T;
    }

    // Attempt to parse JSON regardless of status (Django often returns error bodies).
    const contentType = res.headers.get('content-type') ?? '';
    const isJson = contentType.toLowerCase().includes('application/json');
    const responseBody = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        let message = formatDjangoErrorBody(responseBody);
        if (message === 'Request failed' && responseBody && typeof responseBody === 'object') {
            const r = responseBody as { detail?: unknown; message?: unknown; error?: unknown };
            message = String(r.detail ?? r.message ?? r.error ?? `HTTP ${res.status}`);
        }
        throw new ApiError(res.status, message, responseBody);
    }

    return responseBody as T;
}
