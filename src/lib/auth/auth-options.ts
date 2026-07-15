import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const DJANGO_BASE_URL =
    process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

export const authOptions: NextAuthOptions = {
    providers: [
        // ── Standard email/password login ─────────────────────────────────────
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email:    { label: "Email",    type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                let res: Response;
                try {
                    res = await fetch(`${DJANGO_BASE_URL}/api/users/login/`, {
                        method:  "POST",
                        headers: { "Content-Type": "application/json" },
                        body:    JSON.stringify(credentials),
                    });
                } catch (err) {
                    console.error("[NextAuth] authorize() network error — is Django running?", err);
                    return null;
                }

                if (!res.ok) {
                    const body = await res.text().catch(() => "(unreadable)");
                    console.error(`[NextAuth] authorize() Django returned ${res.status}:`, body);
                    return null;
                }

                const contentType = res.headers.get("content-type") ?? "";
                if (!contentType.toLowerCase().includes("application/json")) return null;

                // Django CustomLoginView response shape:
                // { "token": "...", "refresh_token": "...", "user": { id, email, user_type, ... } }
                const json = await res.json();

                const user = json.user ?? json;

                return {
                    id:                String(user.id ?? ""),
                    name:              user.email ?? "",
                    email:             user.email ?? "",
                    accessToken:       json.token  ?? json.access  ?? "",
                    refreshToken:      json.refresh_token ?? json.refresh ?? "",
                    user_type:         user.user_type         ?? null,
                    company_profile:   user.company_profile   ?? null,
                    candidate_profile: user.candidate_profile ?? null,
                } as any;
            },
        }),

        // ── Social OAuth callback — tokens already issued by Django ────────────
        // Used by /auth/social-callback which receives tokens from the Django
        // GitHub / LinkedIn callback redirect. We verify the token is live by
        // fetching the user profile from Django, then inject everything into
        // the NextAuth session so the frontend treats it as a full session.
        CredentialsProvider({
            id: "social",
            name: "Social",
            credentials: {
                accessToken:  { label: "Access Token",  type: "text" },
                refreshToken: { label: "Refresh Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.accessToken) return null;

                let res: Response;
                try {
                    res = await fetch(`${DJANGO_BASE_URL}/api/users/profile/`, {
                        headers: { Authorization: `Bearer ${credentials.accessToken}` },
                        cache: "no-store",
                    });
                } catch (err) {
                    console.error("[NextAuth] social authorize() network error:", err);
                    return null;
                }

                if (!res.ok) {
                    console.error(`[NextAuth] social authorize() Django /profile/ returned ${res.status}`);
                    return null;
                }

                const user = await res.json();

                return {
                    id:                String(user.id ?? ""),
                    name:              user.email ?? "",
                    email:             user.email ?? "",
                    accessToken:       credentials.accessToken,
                    refreshToken:      credentials.refreshToken ?? "",
                    user_type:         user.user_type         ?? null,
                    company_profile:   user.company_profile   ?? user.profile_data ?? null,
                    candidate_profile: user.candidate_profile ?? user.profile_data ?? null,
                } as any;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Persist everything from authorize() into the JWT.
                token.id               = (user as any).id;
                token.accessToken      = (user as any).accessToken;
                token.refreshToken     = (user as any).refreshToken;
                token.user_type        = (user as any).user_type;
                token.company_profile  = (user as any).company_profile;
                token.candidate_profile = (user as any).candidate_profile;
            }
            return token;
        },

        async session({ session, token }) {
            // Expose all JWT fields to the client-side session.
            const u = session.user as any;
            u.id                 = token.id;
            u.user_type          = token.user_type;
            u.company_profile    = token.company_profile;
            u.candidate_profile  = token.candidate_profile;
            session.accessToken  = token.accessToken as string;
            // Used by apiFetch to rotate access tokens before forcing logout (tradeoff: refresh in JS).
            session.refreshToken = token.refreshToken as string | undefined;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
};