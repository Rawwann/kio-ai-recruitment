"use client"

import React from "react"
import { Button } from "@/components/ui/forms/button"
import { Loader2 } from "lucide-react"

export function Step2_VerifyCode({
    otp,
    otpRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyCode,
    handleSendCode,
    setStep,
    isLoading
}: {
    otp: string[]
    otpRefs: React.MutableRefObject<Array<HTMLInputElement | null>>
    handleOtpChange: (v: string, idx: number) => void
    handleOtpKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => void
    handleVerifyCode: () => void
    handleSendCode: () => void
    setStep: (step: 1 | 2 | 3) => void
    isLoading: boolean
}) {
    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex items-center justify-center gap-2 py-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        type="text" inputMode="numeric" maxLength={1}
                        className="h-12 w-12 rounded-xl border border-gray-200 bg-white text-center text-lg font-semibold text-slate-900 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <Button className="w-full bg-purple-800 text-white" onClick={handleVerifyCode} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Code"}
                </Button>
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <button type="button" onClick={() => setStep(1)} className="font-medium text-slate-600 hover:underline">Change email address</button>
                    <button type="button" onClick={handleSendCode} className="font-medium text-slate-600 hover:underline">Resend Code</button>
                </div>
            </div>
        </div>
    )
}
