import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { LoginForm } from "@/components/features/auth";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        const userType = ((session.user as any)?.user_type ?? "").toUpperCase();
        if (userType === "COMPANY") {
            redirect("/company/dashboard");
        }
        redirect("/candidate/dashboard");
    }

    return (
        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 pt-28">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    );
}