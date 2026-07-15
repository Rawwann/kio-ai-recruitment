"use client";

import { cn } from "@/lib/utils";

interface KioLogoTextProps {
    className?: string;
}

export function KioLogoText({ className }: KioLogoTextProps) {
    return (
        <span
            className={cn(className)}
            style={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background: "linear-gradient(115deg, #6b21a8, #7c3aed, #d97706)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                animation: "kio-gradient-shift 4s ease infinite",
            }}
        >
            KIO
        </span>
    );
}