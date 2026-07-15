"use client"

import { Input } from "@/components/ui/forms/input"
import { Button } from "@/components/ui/forms/button"
import { FaLock } from "react-icons/fa"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function Step3_ResetForm({
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleResetPassword,
    isLoading
}: {
    newPassword: string
    setNewPassword: (v: string) => void
    confirmPassword: string
    setConfirmPassword: (v: string) => void
    showPassword: boolean
    setShowPassword: (v: boolean) => void
    showConfirmPassword: boolean
    setShowConfirmPassword: (v: boolean) => void
    handleResetPassword: () => void
    isLoading: boolean
}) {
    return (
        <>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaLock className="h-4 w-4 text-purple-600" />
                        </div>
                        <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaLock className="h-4 w-4 text-purple-600" />
                        </div>
                        <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>
            <Button className="w-full bg-purple-800 text-white" onClick={handleResetPassword} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
            </Button>
        </>
    )
}
