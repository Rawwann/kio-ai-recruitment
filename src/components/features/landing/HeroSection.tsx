"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ScrollRevealList,
    ScrollRevealItem,
    FADE_UP_VARIANTS,
} from '@/components/ui/animations/ScrollReveal';

export default function HeroSection() {
    return (
        <section className="relative w-full">
            <ScrollRevealList className="container mx-auto px-4 pt-36 pb-8 text-center z-10 relative">

                <ScrollRevealItem>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-purple-950 mb-6 leading-tight">
                        Smarter Hiring
                        <Image
                            src="/logo.svg"
                            width={62}
                            height={62}
                            alt="KIO Logo"
                            className="inline-block align-middle mx-5 rotate-[-15deg] object-contain"
                        />
                        Starts <br />
                        <span className="bg-gradient-to-r from-purple-800 via-violet-600 to-[#d97706] bg-clip-text text-transparent">
                            with Real Work
                        </span>
                    </h1>
                </ScrollRevealItem>

                <ScrollRevealItem>
                    <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
                        An intelligent, data-driven web platform that enables companies to evaluate candidates based on real
                        performance, teamwork, and practical skills.
                    </p>
                </ScrollRevealItem>

                <ScrollRevealItem>
                    <div className="flex flex-col items-center">
                        <div className="mt-[52px] flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                type="button"
                                className="
                                    relative w-[250px] h-[63px]
                                    bg-white/50 backdrop-blur-sm
                                    border-2 border-white rounded-xl
                                    shadow-[0px_0px_16px_4px_rgba(180,156,197,0.08)]
                                    flex items-center justify-center
                                    transition-all duration-300 
                                    hover:scale-105 hover:bg-white/60 
                                    active:scale-[0.98]
                                    overflow-hidden group
                                "
                            >
                                <span className="text-[#7b2cbf] text-[16.9px] font-semibold tracking-[-0.18px] opacity-80 leading-[21.6px]">
                                    Get your 14 Days Trial
                                </span>
                            </button>

                            <button
                                type="button"
                                className="kio-btn-ai-primary w-[250px] h-[63px] flex items-center justify-center rounded-xl transition-all active:scale-[0.98]"
                            >
                                <span className="text-[16.9px] font-semibold tracking-[-0.18px]">
                                    Watch your Demo
                                </span>
                            </button>
                        </div>
                    </div>
                </ScrollRevealItem>

                <ScrollRevealItem>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-purple-900/60 mt-12">
                        <span>Instant Deployment</span>
                        <span className="w-1 h-1 bg-purple-300 rounded-full" />
                        <span>Privacy-First Architecture</span>
                        <span className="w-1 h-1 bg-purple-300 rounded-full" />
                        <span>Enterprise-Grade Security</span>
                        <div className="h-[18px]" />
                    </div>
                </ScrollRevealItem>

            </ScrollRevealList>

            <ScrollRevealItem className="w-full flex justify-center px-4 md:px-10 z-20 mt-12">
                <div className="w-full max-w-[1400px] mx-auto transition-all z-20 px-4 md:px-10">
                    <Image
                        src="/herosection-img.png"
                        alt="KIO Dashboard Preview"
                        width={1400}
                        height={800}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </ScrollRevealItem>
        </section>
    );
}