"use client"

import Link from "next/link"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { FaEnvelope } from "react-icons/fa"
import { Loader2 } from "lucide-react"

export function Step1_ForgotPassword({
    email,
    setEmail,
    handleSendCode,
    isLoading
}: {
    email: string
    setEmail: (v: string) => void
    handleSendCode: () => void
    isLoading: boolean
}) {
    return (
        <>
            <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaEnvelope className="h-4 w-4 text-purple-800" />
                    </div>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" type="email" />
                </div>
            </div>
            <Button className="w-full bg-purple-900 text-white" onClick={handleSendCode} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
            </Button>
            <div className="text-center text-sm text-slate-600">
                <Link href="/login" className="font-medium text-slate-600 hover:underline">Back to Sign In</Link>
            </div>
        </>
    )
}
