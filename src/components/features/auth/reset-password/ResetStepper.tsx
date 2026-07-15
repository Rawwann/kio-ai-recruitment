"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa"

function StepperItem({ active, completed, label, icon }: { active: boolean, completed: boolean, label: string, icon: React.ReactNode }) {
    const circle = cn(
        "flex h-10 w-10 items-center justify-center rounded-full border",
        active ? "border-purple-600 bg-purple-800 text-white" : completed ? "border-purple-600 bg-purple-50 text-purple-800" : "border-gray-200 bg-white text-slate-500"
    )
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={circle}>{icon}</div>
            <span className={cn("text-xs font-medium", active || completed ? "text-purple-800" : "text-slate-500")}>{label}</span>
        </div>
    )
}

export function Stepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="flex items-center justify-between">
            <StepperItem active={currentStep === 1} completed={currentStep > 1} label="Mail" icon={<FaEnvelope className="h-4 w-4" />} />
            <div className="h-px flex-1 bg-gray-200" />
            <StepperItem active={currentStep === 2} completed={currentStep > 2} label="Key" icon={<FaKey className="h-4 w-4" />} />
            <div className="h-px flex-1 bg-gray-200" />
            <StepperItem active={currentStep === 3} completed={false} label="Lock" icon={<FaLock className="h-4 w-4" />} />
        </div>
    )
}


