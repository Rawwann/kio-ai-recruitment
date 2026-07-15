export type BillingCycle = "monthly" | "annually";

export interface BillingPlan {
    name: string;
    price: number; // in EGP/month
    cycle: BillingCycle;
    features: string[];
    nextBillingDate: string; // ISO date string
    isPopular?: boolean;
}

export interface PaymentMethod {
    id: string;
    last4: string;
    brand: "visa" | "mastercard" | "amex" | "discover";
    expiry: string; // MM/YY
    isDefault: boolean;
    holderName: string;
}

export interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    description: string;
}
