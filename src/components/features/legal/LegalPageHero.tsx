"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText } from "lucide-react";

// ──────────────────────────────────────────────────────────────────
// LegalPageHero
// Shared hero section used by both PrivacyPolicy and TermsAndConditions.
// Owns: purple hero banner, breadcrumb nav, icon box, animated h1,
//       animated subtitle, and the S-curve SVG wave divider.
// ──────────────────────────────────────────────────────────────────
export function LegalPageHero({
    title,
    breadcrumbLabel,
    lastUpdated,
}: {
    title: string;
    breadcrumbLabel: string;
    lastUpdated: string;
}) {
    return (
        <div className="relative bg-purple-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 to-purple-950 pb-32 pt-36 text-center overflow-hidden">
            <div className="relative z-20 max-w-4xl mx-auto px-4 flex flex-col items-center">

                {/* Breadcrumb */}
                <nav className="mb-8 text-sm font-medium text-purple-200/80">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="mx-2">›</span>
                    <span className="text-purple-100">{breadcrumbLabel}</span>
                </nav>

                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm shadow-inner">
                    <FileText className="h-7 w-7 text-white" />
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-purple-200/90 text-lg md:text-xl font-medium tracking-wide"
                >
                    {lastUpdated}
                </motion.p>
            </div>

            {/* Elegant S-Curve Divider */}
            <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
                <svg
                    className="relative block w-full h-[50px] md:h-[80px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#FDFBFF"
                        d="M0,50 C480,100 960,0 1440,50 L1440,100 L0,100 Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}