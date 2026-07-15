"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle2, Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/overlays/dialog";
import { Button } from "@/components/ui/forms/button";
import { BillingPlan } from "@/types";
import { PRICING_TIERS } from "../../../lib/constants/company/pricing-tiers";

// ──────────────────────────────────────────────────────────────────
// Upgrade Plan Dialog
// ──────────────────────────────────────────────────────────────────
export function UpgradePlanDialog({
    open,
    onClose,
    currentPlan,
    onPlanSwitch,
}: {
    open: boolean;
    onClose: () => void;
    currentPlan: string;
    onPlanSwitch: (plan: BillingPlan) => void;
}) {
    const [selecting, setSelecting] = useState<string | null>(null);

    const handleSelect = async (tier: typeof PRICING_TIERS[number]) => {
        setSelecting(tier.name);
        await new Promise((r) => setTimeout(r, 1000));

        const newPlan: BillingPlan = {
            name: tier.name,
            price: tier.price,
            cycle: "monthly",
            features: [...tier.features],
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            isPopular: "popular" in tier ? tier.popular : undefined,
        };

        onPlanSwitch(newPlan);
        setSelecting(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader className="">
                    <DialogTitle className="flex items-center gap-2 text-gray-800">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <Zap className="size-4 text-purple-600" />
                        </div>
                        Choose Your Plan
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-2">
                    {PRICING_TIERS.map((tier) => {
                        const isCurrent = tier.name === currentPlan;
                        return (
                            <motion.div
                                key={tier.name}
                                whileHover={{ scale: isCurrent ? 1 : 1.02 }}
                                className={`relative rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${isCurrent
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-100 bg-white hover:border-purple-300"
                                    }`}
                            >
                                {"popular" in tier && tier.popular && !isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                            <Star className="size-2.5 fill-white" /> Popular
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-gray-800">{tier.name}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-2xl font-black text-gray-900">
                                            {tier.price.toLocaleString("en-EG")}
                                        </span>
                                        <span className="text-xs text-gray-400">EGP/mo</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                                </div>
                                <ul className="space-y-1.5 flex-1">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                                            <CheckCircle2 className="size-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    onClick={() => !isCurrent && handleSelect(tier)}
                                    disabled={isCurrent || selecting === tier.name}
                                    className={`w-full h-8 text-xs font-semibold mt-2 ${isCurrent
                                        ? "bg-purple-100 text-purple-600 cursor-default"
                                        : "bg-purple-600 hover:bg-purple-700 text-white"
                                        }`}
                                >
                                    {isCurrent ? "Current Plan" : selecting === tier.name ? "Switching..." : `Switch to ${tier.name}`}
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
                <DialogFooter className="">
                    <Button variant="outline" onClick={onClose} className="h-9">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}