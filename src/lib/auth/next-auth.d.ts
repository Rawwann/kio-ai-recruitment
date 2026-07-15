import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        user_type?: "COMPANY" | "CANDIDATE" | null;
        company_profile?: Record<string, unknown> | null;
        candidate_profile?: Record<string, unknown> | null;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
            user_type: "COMPANY" | "CANDIDATE" | null;
            company_profile: Record<string, unknown> | null;
            candidate_profile: Record<string, unknown> | null;
        };
        accessToken: string;
        /** Django refresh JWT; exposed for client-side silent refresh in apiFetch (keep httpOnly strategy for stricter prod hardening). */
        refreshToken?: string;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        accessToken: string;
        refreshToken?: string;
        user_type?: "COMPANY" | "CANDIDATE" | null;
        company_profile?: Record<string, unknown> | null;
        candidate_profile?: Record<string, unknown> | null;
    }
}
