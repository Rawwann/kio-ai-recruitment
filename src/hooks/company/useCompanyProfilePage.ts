import { useState, useEffect, useCallback } from "react";
import { CompanyProfile, PaymentMethod, BillingPlan, BillingHistoryItem, TabKey } from "@/types";
import { useCompany } from "@/lib/contexts/CompanyContext";
import { PRICING_TIERS } from "@/lib/constants/company/pricing-tiers";
import { toast } from "sonner";

/**
 * Build a PaymentMethod object from the Stripe card preview returned by Django.
 * Returns null if the data is missing / incomplete.
 */
function _toPaymentMethod(card: Record<string, unknown> | null | undefined): PaymentMethod | null {
    if (!card || typeof card !== "object") return null;
    const last4 = String(card.last4 ?? "");
    if (!last4) return null;
    const rawBrand = String(card.brand ?? "").toLowerCase();
    const brand: PaymentMethod["brand"] =
        rawBrand === "visa" ? "visa"
            : rawBrand === "mastercard" ? "mastercard"
                : rawBrand === "amex" ? "amex"
                    : rawBrand === "discover" ? "discover"
                        : "visa"; // safe fallback
    const expMonth = Number(card.exp_month ?? 0);
    const expYear = Number(card.exp_year ?? 0);
    const expiry = expMonth && expYear
        ? `${String(expMonth).padStart(2, "0")}/${String(expYear).slice(-2)}`
        : "--/--";
    return {
        id: String(card.id ?? `pm_${last4}_${Date.now()}`),
        last4,
        brand,
        expiry,
        isDefault: true,
        holderName: "",
    };
}

/** Build a billing history entry for a successful subscription payment. */
function _toBillingHistoryItem(planName: string, price: number): BillingHistoryItem {
    return {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString(),
        amount: price,
        status: "paid",
        description: `${planName} Plan — Monthly subscription`,
    };
}

function _coerceCompanyProfileFields(
    raw: Record<string, unknown>,
    fallback: CompanyProfile,
): CompanyProfile {
    const cp =
        (raw.company_profile as Record<string, unknown> | undefined) ??
        (raw.profile_data as Record<string, unknown> | undefined) ??
        raw;

    return {
        ...fallback,
        id: String(cp.id ?? fallback.id ?? ""),
        name: String(cp.company_name ?? cp.name ?? fallback.name ?? ""),
        website: String(cp.website ?? fallback.website ?? ""),
        location: String(cp.location ?? fallback.location ?? ""),
        industry: String(cp.industry ?? fallback.industry ?? ""),
        about: String(cp.bio ?? cp.about ?? fallback.about ?? ""),
        foundedYear: Number(cp.founded_year ?? cp.foundedYear ?? fallback.foundedYear) || undefined,
        size: cp.size ? (cp.size as CompanyProfile["size"]) : fallback.size,
        tags: Array.isArray(cp.tags) ? (cp.tags as string[]) : fallback.tags,
        logoUrl: _durableLogoUrl(cp.logo_url ?? cp.logoUrl, window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) ?? fallback.logoUrl ?? ""),
        linkedinUrl: String(cp.linkedin_url ?? cp.linkedinUrl ?? fallback.linkedinUrl ?? ""),
    };
}

function _toCompanyProfilePayload(profile: CompanyProfile) {
    return {
        profile_data: {
            company_name: profile.name,
            website: profile.website,
            location: profile.location,
            industry: profile.industry,
            size: profile.size,
            founded_year: profile.foundedYear,
            bio: profile.about,
            about: profile.about,
            tags: profile.tags,
            logo_url: profile.logoUrl,
            linkedin_url: profile.linkedinUrl,
        },
    };
}

const COMPANY_LOGO_STORAGE_KEY = "kio.company.logoUrl";

function _durableLogoUrl(value: unknown, fallback = "") {
    const logoUrl = String(value ?? "").trim();
    return logoUrl.startsWith("blob:") ? fallback : logoUrl;
}

export function useCompanyProfilePage(
    initialSessionId?: string | null,
    initialTab?: string | null,
) {
    const { companyData, setCompanyData } = useCompany();

    // Activate billing tab automatically when Stripe redirects back with
    // ?tab=billing&session_id=...  or when the user deep-links ?tab=billing.
    const resolvedTab = (initialTab ?? "general") as TabKey;
    const [activeTab, setActiveTab] = useState<TabKey>(
        (["general", "team", "billing", "notifications", "security"].includes(resolvedTab)
            ? resolvedTab
            : "general") as TabKey,
    );

    const [loading, setLoading] = useState(true);

    // ── Empty profile shape ───────────────────────────────────────────────────
    // Shared initial value for both working copy and saved snapshot.
    // Profile text fields start empty so a new Gmail / social-auth user never
    // sees mock placeholder strings.  Structural / billing / team data comes
    // from the context mock so those tabs render correctly in dev.
    const emptyProfile: CompanyProfile = {
        ...companyData,           // billing, team, paymentMethods, notifications
        id: "",
        name: "",
        website: "",
        location: "",
        industry: "",
        // undefined → sidebar hides the row until real data arrives from the DB
        size: undefined,
        foundedYear: undefined,
        about: "",
        tags: [],
        logoUrl: "",
        linkedinUrl: "",
    };

    // ── Working copy — updated on every form keystroke via handleFormChange ───
    // Used only by the form / GeneralInfoTab.  NOT passed to the sidebar.
    const [localData, setLocalData] = useState<CompanyProfile>(emptyProfile);

    // ── Saved snapshot — updated ONLY after a successful save API call ────────
    // The sidebar reads exclusively from this state so it never reflects
    // unsaved typing.  handleCancel also resets localData back to this.
    const [savedProfile, setSavedProfile] = useState<CompanyProfile>(emptyProfile);

    // Track plan-selection Stripe redirect in progress
    const [isSelectingPlan, setIsSelectingPlan] = useState<string | null>(null);

    // ── Fetch company profile from Django on mount ────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/profile/", { cache: "no-store" });
                if (res.ok) {
                    const json = await res.json();
                    const cp: Record<string, unknown> =
                        (json.company_profile as Record<string, unknown>) ??
                        (json.profile_data as Record<string, unknown>) ??
                        (json as Record<string, unknown>);

                    // Always overwrite profile text fields with API values —
                    // never fall back to mock data.  An absent / empty field
                    // from the API intentionally produces an empty input.
                    const fetchedFields = (prev: CompanyProfile): CompanyProfile => ({
                        ...prev,
                        id: String(cp.id ?? ""),
                        name: String(cp.company_name ?? ""),
                        website: String(cp.website ?? ""),
                        location: String(cp.location ?? ""),
                        industry: cp.industry != null ? String(cp.industry) : "",
                        about: String(cp.bio ?? cp.about ?? ""),
                        // undefined = field not set → sidebar hides the row entirely
                        foundedYear: cp.founded_year != null ? (Number(cp.founded_year) || undefined) : prev.foundedYear,
                        size: cp.size != null ? (cp.size as CompanyProfile["size"]) : undefined,
                        tags: cp.tags != null ? (Array.isArray(cp.tags) ? (cp.tags as string[]) : []) : [],
                        logoUrl: _durableLogoUrl(
                            cp.logo_url,
                            window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) ?? "",
                        ),
                        linkedinUrl: String(cp.linkedin_url ?? ""),
                    });
                    // Populate the working copy (bound to the form)
                    setLocalData(fetchedFields);
                    // Populate the saved snapshot (bound to the sidebar)
                    setSavedProfile(fetchedFields);
                }
            } catch {
                // API unreachable (dev without Django, or unauthenticated) — leave fields empty
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ── Fetch real subscription status from Django on mount ───────────────────
    // Overwrites the context mock's hasActiveSubscription with the DB truth.
    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await fetch("/api/stripe/subscription/", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();

                if (data.has_subscription) {
                    // Build a BillingPlan from the DB record
                    const tier = PRICING_TIERS.find((t) => t.name === data.plan_name);
                    const price = data.price_monthly ?? tier?.price ?? 0;
                    const plan: BillingPlan = {
                        name: data.plan_name,
                        price,
                        cycle: "monthly",
                        features: tier ? [...tier.features] : [],
                        nextBillingDate: data.current_period_end
                            ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        isPopular: "popular" in (tier ?? {}) ? (tier as any).popular : undefined,
                    };

                    // BUG-4.9: Populate payment method from Stripe customer data
                    const pm = _toPaymentMethod(data.payment_method);

                    // BUG-4.9: Build a billing history entry from the active subscription
                    const historyEntry = _toBillingHistoryItem(data.plan_name, price);

                    setCompanyData((prev) => {
                        // Merge payment method (avoid duplicates by id)
                        let methods = prev.paymentMethods;
                        if (pm && !methods.some((m) => m.id === pm.id)) {
                            methods = [pm, ...methods];
                        }
                        // Merge history entry (only if history is empty — avoid duplication on re-mount)
                        let history = prev.billing.history;
                        if (history.length === 0) {
                            history = [historyEntry];
                        }
                        return {
                            ...prev,
                            paymentMethods: methods,
                            billing: {
                                ...prev.billing,
                                currentPlan: plan,
                                hasActiveSubscription: true,
                                history,
                            },
                        };
                    });
                } else {
                    // Ensure the flag is cleared (e.g. mock was true but DB says false)
                    setCompanyData((prev) => ({
                        ...prev,
                        billing: {
                            ...prev.billing,
                            hasActiveSubscription: false,
                        },
                    }));
                }
            } catch {
                // Django unavailable — keep whatever is in the context
            }
        };

        fetchSubscription();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Verify Stripe session after redirect-back ─────────────────────────────
    // Stripe redirects to /company/profile?tab=billing&session_id=cs_xxx
    // We verify server-side and activate the plan card.
    useEffect(() => {
        if (!initialSessionId) return;

        const verifySession = async () => {
            try {
                const res = await fetch(
                    `/api/stripe/verify-session/?session_id=${encodeURIComponent(initialSessionId)}`,
                );

                if (res.ok) {
                    const data = await res.json();
                    const planName = data.plan;
                    const priceMonthly = data.price_monthly;
                    const periodEnd = data.current_period_end;
                    const paymentMethodRaw = data.payment_method;

                    const tier = PRICING_TIERS.find((t) => t.name === planName);
                    const price = priceMonthly ?? tier?.price ?? 0;
                    const plan: BillingPlan = {
                        name: planName,
                        price,
                        cycle: "monthly",
                        features: tier ? [...tier.features] : [],
                        nextBillingDate: periodEnd
                            ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        isPopular: "popular" in (tier ?? {}) ? (tier as any).popular : undefined,
                    };

                    // BUG-4.9: Build payment method and billing history from verified session
                    const pm = _toPaymentMethod(paymentMethodRaw);
                    const historyEntry = _toBillingHistoryItem(planName, price);

                    setCompanyData((prev) => {
                        // Merge payment method (avoid duplicates)
                        let methods = prev.paymentMethods;
                        if (pm && !methods.some((m) => m.id === pm.id)) {
                            methods = [pm, ...methods];
                        }
                        return {
                            ...prev,
                            paymentMethods: methods,
                            billing: {
                                ...prev.billing,
                                currentPlan: plan,
                                hasActiveSubscription: true,
                                history: [historyEntry, ...prev.billing.history],
                            },
                        };
                    });
                    toast.success(`Welcome to the ${planName} plan!`, {
                        description: "Your subscription is now active.",
                    });
                }
            } catch {
                // Silently ignore — user sees the billing tab normally
            }
        };

        verifySession();
    }, [initialSessionId]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleUpdateProfile = async (updates: Partial<CompanyProfile>) => {
        const saved: CompanyProfile = { ...localData, ...updates };
        try {
            const res = await fetch("/api/users/profile/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(_toCompanyProfilePayload(saved)),
            });

            if (!res.ok) {
                let message = `Server error ${res.status}.`;
                try {
                    const errBody = await res.json();
                    message =
                        errBody?.detail ??
                        errBody?.message ??
                        errBody?.error ??
                        message;
                } catch {
                    // Keep status-based fallback.
                }
                throw new Error(message);
            }

            const json = (await res.json()) as Record<string, unknown>;
            const persisted = _coerceCompanyProfileFields(json, saved);

            if (!persisted.logoUrl && saved.logoUrl) {
                persisted.logoUrl = saved.logoUrl;
            }

            setCompanyData((prev) => ({
                ...prev,
                ...persisted,
                billing: prev.billing,
                team: prev.team,
                paymentMethods: prev.paymentMethods,
                notifications: prev.notifications,
            }));
            setLocalData(persisted);
            setSavedProfile(persisted);
            try {
                if (persisted.logoUrl) {
                    window.localStorage.setItem(COMPANY_LOGO_STORAGE_KEY, persisted.logoUrl);
                } else {
                    window.localStorage.removeItem(COMPANY_LOGO_STORAGE_KEY);
                }
            } catch {
                // Saving to Django succeeded; local logo fallback is best-effort.
            }
            toast.success("Profile updated successfully!", {
                description: "Your company profile has been saved.",
            });
            return;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Please try again.";
            toast.error("Profile update failed", { description: message });
            throw err;
        }
    };

    const handleSyncSuccess = (updates: Partial<CompanyProfile>) => {
        setLocalData((prev) => ({ ...prev, ...updates }));
    };

    const handleFormChange = useCallback((updates: Partial<CompanyProfile>) => {
        setLocalData((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleLogoChange = useCallback((logoUrl: string) => {
        setLocalData((prev) => ({ ...prev, logoUrl }));
    }, []);

    const handlePlanSwitch = (newPlan: BillingPlan) => {
        setCompanyData((prev) => ({
            ...prev,
            billing: {
                ...prev.billing,
                currentPlan: newPlan,
                hasActiveSubscription: true,
            },
        }));
        toast.success(`Switched to ${newPlan.name} plan!`, {
            description: "Your billing will be updated at the next cycle.",
        });
    };

    // ── Plan selection — calls Django → Stripe Checkout ───────────────────────
    const handleSelectPlan = useCallback(async (planName: string) => {
        setIsSelectingPlan(planName);
        try {
            const res = await fetch("/api/stripe/create-checkout-session/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planName }),
            });

            if (res.ok) {
                const { url } = await res.json();
                if (url) {
                    // Stripe-hosted checkout page — keep spinner until navigation
                    window.location.href = url;
                    return;
                }
            }

            // ── DEV FALLBACK: Stripe not configured → simulate subscription ──
            const tier = PRICING_TIERS.find((t) => t.name === planName);
            if (tier) {
                const plan: BillingPlan = {
                    name: tier.name,
                    price: tier.price,
                    cycle: "monthly",
                    features: [...tier.features],
                    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    isPopular: "popular" in tier ? (tier as any).popular : undefined,
                };
                setCompanyData((prev) => ({
                    ...prev,
                    billing: {
                        ...prev.billing,
                        currentPlan: plan,
                        hasActiveSubscription: true,
                    },
                }));
                toast.success(`Subscribed to ${planName}!`, {
                    description: "Stripe not configured — this is a simulated subscription.",
                });
            }
        } catch {
            toast.error("Checkout failed. Please try again.");
        } finally {
            setIsSelectingPlan(null);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCancel = () => {
        // Discard unsaved edits — restore the working copy from the last saved
        // snapshot (not from companyData which may differ in billing/team).
        setLocalData({ ...savedProfile, billing: companyData.billing, team: companyData.team });
        toast.info("Changes discarded.");
    };

    const handleDeleteMember = (id: string) => {
        setCompanyData((prev) =>
            prev ? { ...prev, team: prev.team.filter((m) => m.id !== id) } : prev,
        );
    };

    const handleInviteMember = (email: string, role: string) => {
        setCompanyData((prev) => {
            if (!prev) return prev;
            const newMember = {
                id: `team_${Date.now()}`,
                name: email.split("@")[0],
                email,
                role: role || "Member",
                status: "pending" as const,
                joinedAt: new Date().toISOString(),
            };
            return { ...prev, team: [newMember, ...prev.team] };
        });
    };

    const handleDeletePaymentMethod = (id: string) => {
        setCompanyData((prev) =>
            prev
                ? { ...prev, paymentMethods: prev.paymentMethods.filter((p) => p.id !== id) }
                : prev,
        );
    };

    const handleAddPaymentMethod = (card: PaymentMethod) => {
        setCompanyData((prev) =>
            prev ? { ...prev, paymentMethods: [...prev.paymentMethods, card] } : prev,
        );
    };

    return {
        activeTab,
        setActiveTab,
        companyData,
        loading,
        localData,
        savedProfile,
        isSelectingPlan,
        handleUpdateProfile,
        handleSyncSuccess,
        handleFormChange,
        handleLogoChange,
        handlePlanSwitch,
        handleSelectPlan,
        handleCancel,
        handleDeleteMember,
        handleInviteMember,
        handleDeletePaymentMethod,
        handleAddPaymentMethod,
    };
}
