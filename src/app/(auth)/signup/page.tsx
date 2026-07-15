import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { SignupForm } from "@/components/features/auth";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        const userType = ((session.user as any)?.user_type ?? "").toUpperCase();
        if (userType === "COMPANY") {
            redirect("/company/dashboard");
        }
        redirect("/candidate/dashboard");
    }

    return <SignupForm />;

}
