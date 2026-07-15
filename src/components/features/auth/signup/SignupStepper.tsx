"use client";
import React from "react";
import { SignupStepperProps } from "@/types";

export default function SignupStepper({ currentStep, role }: SignupStepperProps) {
    const totalSteps = role === 'candidate' ? 3 : 2;

    return (
        <div className="flex items-center justify-center space-x-4 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${step === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : step < currentStep
                                ? 'bg-green-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        {step < currentStep ? '✓' : step}
                    </div>
                    {step < totalSteps && (
                        <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-muted'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );
}