"use client";

import { useState, useEffect } from "react";
import { BriefcaseBusiness, ExternalLink, MapPin, Users, CalendarDays } from "lucide-react";
import { CompanyProfile } from "@/types";

export function CompanySidebar({ data }: { data: CompanyProfile | null }) {
    const [logoError, setLogoError] = useState(false);
    const hasLogo = !!data?.logoUrl && data.logoUrl.trim() !== "" && !logoError;

    useEffect(() => { setLogoError(false); }, [data?.logoUrl]);

    // Derived booleans — only show a field when a real value exists.
    const hasName = !!data?.name?.trim();
    const hasIndustry = !!data?.industry?.trim();
    const hasAbout = !!data?.about?.trim();
    const hasLocation = !!data?.location?.trim();
    const hasSize = !!data?.size;
    const hasFounded = !!data?.foundedYear;
    const hasWebsite = !!data?.website?.trim();
    const hasTags = Array.isArray(data?.tags) && data!.tags.length > 0;
    const hasAnyDetail = hasLocation || hasSize || hasFounded;

    // Subscription state — false means the company is on the Free tier.
    const isSubscribed = data?.billing.hasActiveSubscription ?? false;
    const planName = isSubscribed ? (data?.billing.currentPlan.name ?? "Free") : "Free";
    const planPrice = isSubscribed ? (data?.billing.currentPlan.price ?? 0) : null;

    const activeMembers = data?.team.filter((m) => m.status === "active").length ?? 0;

    return (
        <div className="space-y-4">
            {/* ── Company identity card ─────────────────────────────────── */}
            <div className="rounded-2xl border border-purple-100 bg-white shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 flex-1">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md overflow-hidden mb-3 ${hasLogo
                            ? "bg-white border-2 border-gray-100"
                            : "bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800"
                            }`}>
                            {hasLogo ? (
                                <img
                                    src={data!.logoUrl}
                                    alt={data?.name ?? "Company Logo"}
                                    className="w-full h-full object-contain p-1.5"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <BriefcaseBusiness className="size-8 text-white" />
                            )}
                        </div>

                        <div className="space-y-1 w-full">
                            {hasName && (
                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                    {data!.name}
                                </p>
                            )}
                            {hasIndustry && (
                                <p className="text-xs font-medium text-purple-600">
                                    {data!.industry}
                                </p>
                            )}
                            {hasAbout && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed max-w-[240px] mx-auto">
                                    {data!.about}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Only render the detail rows section when at least one value exists */}
                    {hasAnyDetail && (
                        <div className="space-y-3 px-1 text-sm text-gray-600">
                            {hasLocation && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50/50">
                                    <span className="text-gray-400 flex items-center gap-1.5">
                                        <MapPin className="size-3.5" />Location
                                    </span>
                                    <span className="font-medium text-gray-800 text-right max-w-[130px] truncate" title={data!.location}>
                                        {data!.location}
                                    </span>
                                </div>
                            )}
                            {hasSize && (
                                <div className={`flex justify-between items-center py-1 ${hasFounded ? "border-b border-gray-50/50" : ""}`}>
                                    <span className="text-gray-400 flex items-center gap-1.5">
                                        <Users className="size-3.5" />Size
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {data!.size} employees
                                    </span>
                                </div>
                            )}
                            {hasFounded && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-400 flex items-center gap-1.5">
                                        <CalendarDays className="size-3.5" />Founded
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {data!.foundedYear}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-purple-50">
                    {hasWebsite ? (
                        <a href={data!.website} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <button className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-purple-200 bg-white text-xs font-semibold text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors shadow-sm">
                                <ExternalLink className="size-3.5" />
                                Visit Website
                            </button>
                        </a>
                    ) : (
                        <button disabled className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400 cursor-not-allowed">
                            <ExternalLink className="size-3.5" />
                            Visit Website
                        </button>
                    )}
                </div>
            </div>

            {/* ── Current plan card ─────────────────────────────────────── */}
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-800 via-violet-600 to-[#d97706] p-5 text-white text-center shadow-md">
                <p className="text-xs font-semibold text-purple-200 uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-2xl font-black">{planName}</p>
                {/* Only show price when there is an active paid subscription */}
                {planPrice !== null && (
                    <p className="text-sm text-purple-200 mt-0.5">${planPrice}/mo</p>
                )}
                <div className="mt-3 w-full h-px bg-white/20" />
                <p className="text-xs text-purple-200 mt-3">
                    {activeMembers} active member{activeMembers !== 1 ? "s" : ""}
                </p>
            </div>

            {/* ── Industry tags ─────────────────────────────────────────── */}
            {hasTags && (
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Industry Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                        {data!.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}