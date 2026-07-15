"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/forms/button";
import { Card, CardContent } from "@/components/ui/layout/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldError
} from "@/components/ui/forms/field";
import { Input } from "@/components/ui/forms/input";
import { PasswordInput } from "@/components/ui/forms/password-input";
import { FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

const DJANGO_URL = process.env.NEXT_PUBLIC_DJANGO_URL ?? "http://127.0.0.1:8000";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const { form, onSubmit, isSubmitting } = useLoginForm();

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border border-white/20 shadow-2xl overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={onSubmit} className="p-6 md:p-8 bg-white/20 backdrop-blur-md">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">Login to your KIO account</p>
                            </div>

                            {/* Email */}
                            <Field data-invalid={!!form.formState.errors.email}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="r@example.com"
                                    className="bg-white"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <FieldError errors={[{ message: String(form.formState.errors.email.message ?? "") }]} />
                                )}
                            </Field>

                            {/* Password */}
                            <Field data-invalid={!!form.formState.errors.password}>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">Forgot?</a>
                                </div>
                                <PasswordInput
                                    id="password"
                                    placeholder='Rawan@123'
                                    className="bg-white"
                                    {...form.register("password")}
                                />
                                {form.formState.errors.password && (
                                    <FieldError errors={[{ message: String(form.formState.errors.password.message ?? "") }]} />
                                )}
                            </Field>

                            <Button type="submit" disabled={isSubmitting} className='bg-purple-950 w-full kio-btn-ai-primary'>
                                {isSubmitting ? "Loading..." : "Login"}
                            </Button>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white">
                                Or continue with
                            </FieldSeparator>

                            {/* Social Buttons */}
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    variant="outline" type="button" className="w-full gap-2"
                                    onClick={() => window.location.href = `${DJANGO_URL}/api/users/linkedin/login/?role=candidate`}
                                    title="Continue with LinkedIn"
                                ><FaLinkedin className="size-4" /></Button>
                                <Button
                                    variant="outline" type="button" className="w-full gap-2"
                                    onClick={() => window.location.href = `${DJANGO_URL}/api/users/github/login/?role=candidate`}
                                    title="Continue with GitHub"
                                ><FaGithub className="size-4" /></Button>
                                <Button
                                    variant="outline" type="button" className="w-full gap-2"
                                    onClick={() => window.location.href = `${DJANGO_URL}/api/users/google/login/?role=candidate`}
                                    title="Continue with Google"
                                ><FaGoogle className="size-4" /></Button>
                            </div>

                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <a href="#">Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div
                        className="relative hidden md:flex flex-col items-center justify-center p-8 md:p-12 bg-purple-50/50"
                        style={{ backgroundImage: 'url(/bg-lines.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <img src="/logo.svg" alt="KIO Logo" className="w-20 h-auto mb-6 drop-shadow-md z-10" />
                        <h2 className="text-2xl leading-tight font-bold text-center bg-[linear-gradient(115deg,#6b21a8,#7c3aed,#d97706)] bg-clip-text] bg-clip-text text-transparent drop-shadow-sm z-10">
                            Knowledge, Intelligence,<br />Opportunities.

                        </h2>
                    </div>                </CardContent>
            </Card>
        </div>
    );
}