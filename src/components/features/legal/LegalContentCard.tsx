"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Mail } from "lucide-react";
import { LegalSection } from "@/types/legal";

// ──────────────────────────────────────────────────────────────────
// LegalContentCard
// Shared white paper card used by both legal pages.
// Owns: trust banner, numbered section list, optional CheckCircle2
//       sub-list (PrivacyPolicy only), contact email block,
//       cross-link footer.
//
// Props:
//   renderList — PrivacyPolicy passes true, TermsAndConditions omits
//                it (defaults to false). Controls whether section.list
//                items are rendered with CheckCircle2 icons.
//   sectionLayoutId — per-page Framer Motion layoutId for the active
//                     section left-border indicator.
// ──────────────────────────────────────────────────────────────────
export function LegalContentCard({
    sections,
    activeSection,
    trustBannerText,
    crossLinkHref,
    crossLinkLabel,
    sectionLayoutId,
    renderList = false,
}: {
    sections: LegalSection[];
    activeSection: string;
    trustBannerText: string;
    crossLinkHref: string;
    crossLinkLabel: string;
    sectionLayoutId: string;
    renderList?: boolean;
}) {
    return (
        <div className="w-full md:w-3/4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100/50 p-10 md:p-14">

            {/* Top Trust Banner */}
            <div className="mb-14 flex items-center gap-4 rounded-xl border border-purple-100 bg-purple-50 p-6 shadow-sm">
                <div className="flex shrink-0 items-center justify-center rounded-full bg-white p-3 shadow-sm">
                    <ShieldCheck className="h-7 w-7 text-purple-600" />
                </div>
                <p className="text-purple-900 font-medium leading-relaxed">
                    {trustBannerText}
                </p>
            </div>

            <div className="prose prose-purple max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed flex flex-col gap-8">
                {sections.map((section, index) => {
                    const isSectionActive = activeSection === section.id;
                    const isContact = section.id === "contact-us";

                    return (
                        <section
                            key={section.id}
                            id={section.id}
                            className={`scroll-mt-32 relative ${isContact ? "pt-8" : ""}`}
                        >
                            {isSectionActive && (
                                <motion.div
                                    layoutId={sectionLayoutId}
                                    className={`absolute -left-10 md:-left-14 w-[3px] bg-purple-600 rounded-r-full hidden md:block ${isContact ? "top-10 h-8" : "top-2 h-8"}`}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-lg font-bold text-white shadow-sm mt-0.5">
                                    {index + 1}
                                </div>
                                <h2 className="text-3xl md:text-3xl font-bold tracking-tight text-purple-900 !mt-0 !mb-0">
                                    {section.title}
                                </h2>
                            </div>

                            <p className="text-[15px] md:text-base leading-relaxed pl-14">
                                {section.content}
                            </p>

                            {/* Render list if exists and renderList prop is true (PrivacyPolicy only) */}
                            {renderList && section.list && (
                                <ul className="mt-6 space-y-4 list-none pl-14">
                                    {section.list.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 m-0 p-0">
                                            <CheckCircle2 className="h-6 w-6 shrink-0 text-purple-600 relative top-0.5" />
                                            <span className="text-[15px] md:text-base text-gray-700 leading-relaxed">
                                                {item.title && (
                                                    <strong className="text-purple-900 mr-2">{item.title}:</strong>
                                                )}
                                                {item.description}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Contact email block — rendered for both pages */}
                            {isContact && (
                                <div className="pl-14 pt-4">
                                    <a
                                        href="mailto:support@kio-platform.com"
                                        className="inline-flex items-center gap-3 text-sm md:text-sm font-bold text-purple-700 hover:text-purple-800 transition-colors"
                                    >
                                        <Mail className="h-4 w-4 md:h-4 md:w-4" />
                                        support@kio-platform.com
                                    </a>
                                </div>
                            )}

                            {!isContact && <hr className="mt-12 border-slate-100" />}
                        </section>
                    );
                })}

                {/* Bottom Cross-Link */}
                <div className="mt-16 border-t border-slate-100 pt-8 text-center text-[15px] text-gray-600">
                    By using our site, you agree to this{" "}
                    {crossLinkLabel === "Terms & Conditions"
                        ? "Privacy Policy"
                        : "Terms and Conditions"}
                    . See also our{" "}
                    <Link href={crossLinkHref} className="font-bold text-purple-600 hover:underline">
                        {crossLinkLabel}
                    </Link>.
                </div>
            </div>
        </div>
    );
}