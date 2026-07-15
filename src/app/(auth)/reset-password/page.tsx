"use client";

import React from "react";
import {
    InfoPanel,
    Stepper,
    Step1_ForgotPassword,
    Step2_VerifyCode,
    Step3_ResetForm
} from "@/components/features/auth/reset-password";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { KioLogoText } from "@/components/shared/KIOLogoText";

export default function ResetPasswordPage() {
    const {
        step, setStep, email, setEmail, otp, otpRefs,
        newPassword, setNewPassword, confirmPassword, setConfirmPassword,
        showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
        isLoading, stepTitle, stepDescription,
        handleSendCode, handleVerifyCode, handleResetPassword, handleOtpChange, handleOtpKeyDown
    } = useResetPassword();

    return (
        <main className="min-h-screen bg-transparent flex items-center justify-center px-4 py-10 pt-28">
            <div className="w-full max-w-6xl rounded-2xl border border-border bg-card shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

                {/* Left informational panel */}
                <InfoPanel />

                {/* Right form panel */}
                <div className="flex flex-col items-center bg-card p-10 md:p-12">
                    <header className="flex flex-col items-center justify-center gap-6">
                        <KioLogoText className="text-3xl" />
                    </header>
                    <div className="mt-6 w-full">
                        <Stepper currentStep={step} />
                    </div>
                    <div className="mt-10 w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-foreground text-center">{stepTitle}</h2>
                        <p className="mt-2 text-sm text-muted-foreground text-center">{stepDescription}</p>

                        <div className="mt-8 flex flex-col gap-4">
                            {step === 1 && (
                                <Step1_ForgotPassword
                                    email={email}
                                    setEmail={setEmail}
                                    handleSendCode={handleSendCode}
                                    isLoading={isLoading}
                                />
                            )}
                            {step === 2 && (
                                <Step2_VerifyCode
                                    otp={otp}
                                    otpRefs={otpRefs}
                                    handleOtpChange={handleOtpChange}
                                    handleOtpKeyDown={handleOtpKeyDown}
                                    handleVerifyCode={handleVerifyCode}
                                    handleSendCode={handleSendCode}
                                    setStep={setStep}
                                    isLoading={isLoading}
                                />
                            )}
                            {step === 3 && (
                                <Step3_ResetForm
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                    handleResetPassword={handleResetPassword}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}