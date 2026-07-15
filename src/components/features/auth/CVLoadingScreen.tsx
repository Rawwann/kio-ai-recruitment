"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Step, CVLoadingScreenProps } from "@/types";
import { useCVLoadingSteps } from "@/hooks/auth/useCVLoadingSteps";

export default function CVLoadingScreen({ onComplete }: CVLoadingScreenProps) {
    const { steps } = useCVLoadingSteps(onComplete);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    Analyzing your CV...
                </CardTitle>
                <CardDescription>
                    Our AI extracting and organizing your professional information. This will only take a
                    moment.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-3">
                        {step.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : step.active ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            <p
                                className={`font-medium ${step.completed
                                    ? "text-foreground"
                                    : step.active
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {step.label}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}