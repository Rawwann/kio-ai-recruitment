import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export type LoginPayloadType = z.infer<typeof loginSchema>;

function dashboardForRole(userType: string | null | undefined): string {
    if (userType?.toUpperCase() === "COMPANY") return "/company/dashboard";
    if (userType?.toUpperCase() === "CANDIDATE") return "/candidate/dashboard";
    return "/";
}

export function useLoginForm() {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    }) as any;

    const onSubmit = async (formValues: LoginPayloadType) => {
        try {
            const resp = await signIn("credentials", {
                ...formValues,
                redirect: false,
            });

            if (resp?.ok) {
                toast.success("Login successful!");
                // Read user_type from the freshly-created session
                const session = await getSession();
                const userType = (session?.user as any)?.user_type ?? null;
                router.push(dashboardForRole(userType));
            } else if (resp?.error === "CredentialsSignin") {
                toast.error("Invalid email or password.");
            } else if (!resp) {
                toast.error("Cannot reach the server. Is Django running?");
            } else {
                toast.error(`Login failed: ${resp.error ?? "Unknown error"}`);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting: form.formState.isSubmitting,
    };
}