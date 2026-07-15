"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Suspense } from "react";

function SocialCallbackInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        const access = searchParams.get("access");
        const refresh = searchParams.get("refresh");
        const userType = searchParams.get("user_type") ?? "";
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (code && !access) {
            (async () => {
                const session = await getSession();

                if (session && session.user) {
                    try {
                        const token = (session as any)?.accessToken || (session?.user as any)?.accessToken;
                        await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL || 'http://127.0.0.1:8000'}/api/users/github/connect/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                code: code,
                                redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI
                            })
                        });
                        router.replace("/candidate/dashboard");
                    } catch (error) {
                        console.error("Connect error:", error);
                        router.replace("/candidate/dashboard?error=connect_failed");
                    }
                }
                else {
                    const djangoUrl = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://127.0.0.1:8000';
                    window.location.href = `${djangoUrl}/api/users/github/callback/?code=${code}&state=${state || ''}`;
                }
            })();
            return;
        }

        if (!access) {
            router.replace("/login?error=social_no_token");
            return;
        }

        (async () => {
            const result = await signIn("social", {
                accessToken: access,
                refreshToken: refresh ?? "",
                redirect: false,
            });

            if (!result || result.error) {
                console.error("[social-callback] signIn error:", result?.error);
                router.replace("/login?error=social_auth_failed");
                return;
            }

            try {
                window.history.replaceState(null, "", "/auth/social-callback");
            } catch { /* ignore */ }

            const destination =
                userType.toUpperCase() === "COMPANY"
                    ? "/company/dashboard"
                    : "/candidate/dashboard";

            router.replace(destination);
        })();
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-950 border-t-transparent" />
            <p className="text-muted-foreground text-sm">Logging you in&hellip;</p>
        </div>
    );
}

export default function SocialCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-950 border-t-transparent" />
                </div>
            }
        >
            <SocialCallbackInner />
        </Suspense>
    );
}