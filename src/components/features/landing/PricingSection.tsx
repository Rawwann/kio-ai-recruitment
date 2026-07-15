"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IconCheck, IconHelpCircle, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/layout/card";
import { TagSectionPrimary } from "@/components/features/landing/TagSectionPrimary";
import { LANDING_PRIMARY_GRADIENT } from "@/components/features/landing/ButtonLink";
import { PRICING_PLANS } from "@/lib/constants/landing/pricing-plans";
import { FADE_UP_VARIANTS } from "@/lib/animations";
import { ScrollRevealItem } from '@/components/ui/animations/ScrollReveal';


import type { Variants } from "framer-motion";

export default function PricingSection() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (backendPlan: string, displayName: string) => {
        if (status === "loading") return;

        if (status === "unauthenticated" || !session) {
            router.push("/login?callbackUrl=/pricing");
            return;
        }

        setLoadingPlan(backendPlan);
        try {
            const res = await fetch("/api/stripe/create-checkout-session/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: backendPlan }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Checkout failed");
            }

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
                return;
            }

            toast.info(`Stripe not configured — ${displayName} checkout simulated.`, {
                description: data.reason || "Set up Stripe keys to enable real checkout.",
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to start checkout";
            toast.error(message);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <section className="w-full py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-12 max-w-[1400px] relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <TagSectionPrimary label="FLEXIBLE PLANS" />
                    <h2 className="text-4xl md:text-5xl font-bold text-purple-950 mt-6 mb-6">Plans Designed to Grow With You</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Whether you&apos;re just starting out or scaling rapidly, KIO adapts to your hiring needs with
                        flexible, transparent pricing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
                    {PRICING_PLANS.map((plan, i) => {
                        const isLoading = loadingPlan === plan.backendPlan;
                        const isDisabled = loadingPlan !== null;

                        const RECOMMENDED_VARIANT: Variants = {
                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                            visible: { opacity: 1, y: 0, scale: 1.03, transition: { duration: 0.4, ease: "easeOut" } }
                        };

                        return (
                            <motion.div key={i} variants={plan.highlight ? RECOMMENDED_VARIANT : FADE_UP_VARIANTS}>
                                <Card
                                    className={`relative flex w-full flex-col p-6 sm:p-8 lg:p-10 rounded-[32px] border bg-white/90 backdrop-blur-sm shadow-[0px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl hover:border-amber-300/60 hover:shadow-amber-100/50 ${plan.highlight ? 'border-purple-500 border-2 shadow-purple-200/50' : ''}
                                    `}
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-[36px] font-bold text-purple-950 mb-4">{plan.name}</h3>
                                        <p className="text-gray-600 text-[17px] leading-relaxed min-h-[50px]">{plan.desc}</p>
                                    </div>

                                    <div className="mb-10 flex w-full shrink-0 flex-col items-stretch">
                                        <button
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => handleSubscribe(plan.backendPlan, plan.name)}
                                            style={LANDING_PRIMARY_GRADIENT}
                                            className={`
                                                group relative inline-flex cursor-pointer items-center justify-center
                                                rounded-xl border-0 font-bold tracking-tight text-white shadow-lg
                                                transition-all duration-200 hover:opacity-95 active:scale-[0.98]
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300
                                                focus-visible:ring-offset-2 focus-visible:ring-offset-white/80
                                                disabled:pointer-events-none disabled:opacity-50
                                                min-h-12 h-12 px-5 text-[15px] md:text-base w-full
                                            `}
                                            id={`pricing-subscribe-${plan.backendPlan.toLowerCase()}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <IconLoader2 className="h-4 w-4 animate-spin" />
                                                    Redirecting…
                                                </span>
                                            ) : (
                                                <span className="z-10 min-w-0 truncate text-center">Get started</span>
                                            )}
                                        </button>
                                    </div>

                                    <div className="space-y-5 flex-grow">
                                        <p className="font-bold text-purple-950 mb-4 text-[16px]">This plan includes:</p>
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="mt-0.5 shrink-0">
                                                    <IconCheck className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <span className="text-[15px] text-purple-900/80 leading-snug">{feature}</span>
                                                <IconHelpCircle className="h-4 w-4 text-gray-400 mt-1 cursor-help shrink-0" />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
