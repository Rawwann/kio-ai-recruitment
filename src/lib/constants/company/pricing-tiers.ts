import { BillingPlan } from "@/types";

// ──────────────────────────────────────────────────────────────────
// Pricing Tiers (for Upgrade Dialog)
// ──────────────────────────────────────────────────────────────────
export const PRICING_TIERS = [
    {
        name: "Starter",
        price: 499,
        currency: "EGP",
        description: "Perfect for small teams just getting started.",
        features: ["Up to 5 job postings", "Basic analytics", "Email support"],
        color: "from-gray-500 to-gray-700",
    },
    {
        name: "Growth",
        price: 1499,
        currency: "EGP",
        description: "For growing teams that need more firepower.",
        features: ["Up to 30 job postings", "Advanced analytics", "AI matching (basic)", "Priority support"],
        color: "from-purple-500 to-violet-600",
        popular: true,
    },
    {
        name: "Enterprise",
        price: 2999,
        currency: "EGP",
        description: "Unlimited power for large-scale operations.",
        features: ["Unlimited job postings", "Full AI suite", "Custom integrations", "Dedicated account manager"],
        color: "from-violet-600 to-indigo-700",
    },
] as const;

// ──────────────────────────────────────────────────────────────────
// Credit Card Brand Maps
// ──────────────────────────────────────────────────────────────────
export const brandGradients: Record<string, string> = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-orange-500 to-red-600",
    amex: "from-emerald-600 to-teal-700",
    discover: "from-orange-400 to-amber-600",
};

export const brandLabels: Record<string, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
    discover: "DISC",
};