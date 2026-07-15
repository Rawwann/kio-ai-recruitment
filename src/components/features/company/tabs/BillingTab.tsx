"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    CreditCard,
    Zap,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Star,
    Receipt,
    Plus,
    Loader2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Gift,
} from "lucide-react";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Button } from "@/components/ui/forms/button";
import NumberTicker from "@/components/vendors/magicui/number-ticker";
import { AnimatedList, AnimatedListItem } from "@/components/vendors/magicui/animated-list";
import { BillingTabProps } from "@/types";
import { PRICING_TIERS } from "@/lib/constants/company/pricing-tiers";

import { CreditCardUI } from "@/components/features/billing/CreditCardUI";
import { AddCardDialog } from "@/components/features/billing/AddCardDialog";
import { UpgradePlanDialog } from "@/components/features/billing/UpgradePlanDialog";

// ── Free-plan banner (shown when company has no active subscription) ───────────

function FreePlanBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
    return (
        <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/60 to-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 shrink-0">
                    <Gift className="size-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-0.5">
                        Current Plan
                    </p>
                    <p className="text-2xl font-black text-gray-900">Free</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Limited to 1 active project · Basic analytics only
                    </p>
                </div>
            </div>
            <Button
                onClick={onUpgradeClick}
                className="bg-purple-600 hover:bg-purple-700 text-white h-10 px-5 gap-2 text-sm font-semibold shrink-0"
            >
                <Sparkles className="size-4" />
                Upgrade Plan
            </Button>
        </div>
    );
}

// ── Plan-selection cards (opens after clicking "Upgrade Plan") ─────────────────

function PlanSelectionCards({
    onSelectPlan,
    isSelectingPlan,
}: {
    onSelectPlan: (planName: string) => void;
    isSelectingPlan?: string | null;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-5"
        >
            {/* Section heading */}
            <div className="flex items-center gap-2 pt-2">
                <Sparkles className="size-4 text-purple-500" />
                <p className="text-sm font-semibold text-gray-700">
                    Choose a plan to unlock the full platform
                </p>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PRICING_TIERS.map((tier) => {
                    const isPopular  = "popular" in tier && tier.popular;
                    const isLoading  = isSelectingPlan === tier.name;
                    const isDisabled = !!isSelectingPlan;

                    return (
                        <motion.div
                            key={tier.name}
                            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                            className={`relative rounded-xl border-2 p-5 flex flex-col gap-4 transition-all ${
                                isPopular
                                    ? "border-purple-500 bg-purple-50/60 shadow-md shadow-purple-100"
                                    : "border-gray-100 bg-white hover:border-purple-200"
                            }`}
                        >
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <Star className="size-2.5 fill-white" /> Most Popular
                                    </span>
                                </div>
                            )}

                            <div>
                                <p className="font-bold text-gray-800">{tier.name}</p>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-black text-gray-900">
                                        {tier.price.toLocaleString("en-EG")}
                                    </span>
                                    <span className="text-xs text-gray-400">EGP/mo</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            <ul className="space-y-2 flex-1">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                                        <CheckCircle2 className="size-3.5 text-purple-500 mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => onSelectPlan(tier.name)}
                                disabled={isDisabled}
                                className={`w-full h-9 text-sm font-semibold gap-2 ${
                                    isPopular
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-gray-900 hover:bg-gray-800 text-white"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Redirecting…
                                    </>
                                ) : (
                                    <>
                                        Choose {tier.name}
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            <p className="text-center text-xs text-gray-400 pb-2">
                Secure checkout powered by Stripe · Cancel any time
            </p>
        </motion.div>
    );
}

// ── Active plan card (shown when subscription is active) ──────────────────────

function ActivePlanCard({
    plan,
    onUpgrade,
}: {
    plan: import("@/types").BillingPlan;
    onUpgrade: () => void;
}) {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Current Plan
            </h3>
            <div className="relative rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 overflow-hidden">
                {plan.isPopular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        <Star className="size-3 fill-white" /> Most Popular
                    </div>
                )}
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-100">
                        <Zap className="size-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-gray-900">
                                <NumberTicker
                                    value={plan.price}
                                    className="text-4xl font-black text-gray-900"
                                />
                            </span>
                            <span className="text-gray-500 text-sm">
                                EGP/{plan.cycle === "monthly" ? "mo" : "yr"}
                            </span>
                        </div>
                        <p className="text-xl font-bold text-purple-700 mt-0.5">{plan.name} Plan</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Calendar className="size-3" />
                            Next billing:{" "}
                            {new Date(plan.nextBillingDate).toLocaleDateString("en-US", {
                                month: "long",
                                day:   "numeric",
                                year:  "numeric",
                            })}
                        </div>
                    </div>
                </div>

                {plan.features.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-2">
                        {plan.features.map((feat) => (
                            <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="size-4 text-purple-500 flex-shrink-0" />
                                {feat}
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    onClick={onUpgrade}
                    className="mt-5 bg-purple-600 hover:bg-purple-700 text-white h-9 gap-2 text-sm"
                >
                    Upgrade Plan <ArrowRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}

// ── BillingTab — orchestrator ─────────────────────────────────────────────────

export function BillingTab({
    plan,
    paymentMethods,
    history,
    loading,
    hasSubscription,
    onSelectPlan,
    isSelectingPlan,
    onDeletePaymentMethod,
    onAddPaymentMethod,
    onPlanSwitch,
}: BillingTabProps) {
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [addCardOpen, setAddCardOpen] = useState(false);
    // Controls whether the plan-selection cards are visible (free plan state)
    const [showPlans, setShowPlans] = useState(false);

    if (loading) {
        return (
            <div className="px-8 py-6 space-y-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
            </div>
        );
    }

    // ── Free plan state ────────────────────────────────────────────────────────
    if (!hasSubscription) {
        return (
            <div className="px-8 py-6 space-y-6">
                <FreePlanBanner onUpgradeClick={() => setShowPlans((p) => !p)} />

                <AnimatePresence>
                    {showPlans && (
                        <PlanSelectionCards
                            onSelectPlan={onSelectPlan ?? (() => {})}
                            isSelectingPlan={isSelectingPlan}
                        />
                    )}
                </AnimatePresence>

                {/* Collapse toggle when plans are open */}
                {showPlans && (
                    <button
                        onClick={() => setShowPlans(false)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mx-auto transition-colors"
                    >
                        <ChevronUp className="size-3.5" /> Hide plans
                    </button>
                )}
            </div>
        );
    }

    // ── Active subscription state ──────────────────────────────────────────────
    return (
        <div className="px-8 py-6 space-y-8">

            {/* Current Plan */}
            <ActivePlanCard plan={plan} onUpgrade={() => setUpgradeOpen(true)} />

            {/* Payment Methods */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard className="size-4" /> Payment Methods
                    </h3>
                    <Button
                        onClick={() => setAddCardOpen(true)}
                        variant="outline"
                        className="h-8 px-3 text-xs font-medium border-purple-200 text-purple-600 hover:bg-purple-50 gap-1.5"
                    >
                        <Plus className="size-3.5" /> Add New Card
                    </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                    <AnimatePresence>
                        {paymentMethods.map((card, i) => (
                            <CreditCardUI
                                key={card.id}
                                card={card}
                                index={i}
                                onDelete={onDeletePaymentMethod}
                            />
                        ))}
                    </AnimatePresence>
                    {paymentMethods.length === 0 && (
                        <div className="w-full py-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                            No payment methods added yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Billing History */}
            <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Receipt className="size-4" /> Billing History
                </h3>
                {history.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                        No billing history yet.
                    </p>
                ) : (
                    <AnimatedList className="w-full items-stretch" delay={300}>
                        {history.map((item) => (
                            <AnimatedListItem key={item.id}>
                                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-50">
                                            <Receipt className="size-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {item.description}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(item.date).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day:   "numeric",
                                                    year:  "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {item.amount.toLocaleString("en-EG")} EGP
                                        </span>
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                item.status === "paid"
                                                    ? "bg-green-50 text-green-700"
                                                    : item.status === "pending"
                                                    ? "bg-yellow-50 text-yellow-700"
                                                    : "bg-red-50 text-red-700"
                                            }`}
                                        >
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </AnimatedListItem>
                        ))}
                    </AnimatedList>
                )}
            </div>

            {/* Dialogs */}
            <UpgradePlanDialog
                open={upgradeOpen}
                onClose={() => setUpgradeOpen(false)}
                currentPlan={plan.name}
                onPlanSwitch={onPlanSwitch}
            />
            <AddCardDialog
                open={addCardOpen}
                onClose={() => setAddCardOpen(false)}
                onAdd={onAddPaymentMethod}
            />
        </div>
    );
}
