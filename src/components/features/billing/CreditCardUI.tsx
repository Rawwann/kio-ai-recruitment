"use client";

import { motion } from "framer-motion";
import { Wifi, X } from "lucide-react";
import { toast } from "sonner";
import { PaymentMethod } from "@/types";
import { brandGradients, brandLabels } from "../../../lib/constants/company/pricing-tiers";

// ──────────────────────────────────────────────────────────────────
// Credit Card UI
// ──────────────────────────────────────────────────────────────────
export function CreditCardUI({
    card,
    index,
    onDelete,
}: {
    card: PaymentMethod;
    index: number;
    onDelete: (id: string) => void;
}) {
    const handleDelete = () => {
        toast.warning(`Delete card ending in ${card.last4}?`, {
            description: "This cannot be undone.",
            action: {
                label: "Delete",
                onClick: () => {
                    onDelete(card.id);
                    toast.success(`Card ••••${card.last4} removed.`);
                },
            },
            cancel: { label: "Cancel", onClick: () => { } },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            className="relative group"
        >
            {/* Delete button — visible on hover */}
            <button
                type="button"
                onClick={handleDelete}
                className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Delete card"
            >
                <X className="size-3.5" />
            </button>

            <div
                className={`relative w-full max-w-xs h-44 rounded-2xl bg-gradient-to-br ${brandGradients[card.brand]} p-5 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
                <Wifi className="absolute top-5 right-5 size-5 text-white/60 rotate-90" />

                <div className="text-white/90 font-bold tracking-widest text-lg font-mono">
                    {brandLabels[card.brand]}
                </div>

                {/* Chip */}
                <div className="mt-3 w-10 h-7 rounded-md bg-yellow-300/80 flex items-center justify-center">
                    <div className="w-6 h-4 rounded-sm border border-yellow-500/60 grid grid-cols-2 gap-px p-0.5">
                        <div className="bg-yellow-500/40 rounded-sm" />
                        <div className="bg-yellow-500/40 rounded-sm" />
                        <div className="bg-yellow-500/40 rounded-sm" />
                        <div className="bg-yellow-500/40 rounded-sm" />
                    </div>
                </div>

                <p className="mt-3 text-white font-mono text-sm tracking-[0.2em]">
                    •••• •••• •••• {card.last4}
                </p>

                <div className="mt-2 flex items-end justify-between">
                    <div>
                        <p className="text-white/50 text-[9px] uppercase tracking-widest">Card Holder</p>
                        <p className="text-white text-xs font-medium truncate max-w-[140px]">{card.holderName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/50 text-[9px] uppercase tracking-widest">Expires</p>
                        <p className="text-white text-xs font-medium">{card.expiry}</p>
                    </div>
                </div>

                {card.isDefault && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-full border border-white/30">
                            DEFAULT
                        </span>
                    </div>
                )}

                <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            </div>
        </motion.div>
    );
}