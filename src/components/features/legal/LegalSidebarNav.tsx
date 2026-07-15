"use client";

import { motion } from "framer-motion";
import { LegalSection } from "@/types/legal";

// ──────────────────────────────────────────────────────────────────
// LegalSidebarNav
// Shared sticky sidebar navigation used by both legal pages.
// The layoutId prop is passed per-page to keep Framer Motion's
// shared layout animation scoped correctly:
//   PrivacyPolicy  → layoutId="activePrivacyIndicator"
//   TermsAndConditions → layoutId="activeTermsIndicator"
// ──────────────────────────────────────────────────────────────────
export function LegalSidebarNav({
    sections,
    activeSection,
    onNavigate,
    layoutId,
}: {
    sections: LegalSection[];
    activeSection: string;
    onNavigate: (id: string) => void;
    layoutId: string;
}) {
    return (
        <div className="hidden md:block w-1/4 sticky top-28 pt-4">
            <nav className="flex flex-col border-l border-gray-200">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onNavigate(section.id)}
                            className={`relative px-5 py-3 text-sm text-left transition-all duration-200 ${isActive
                                ? "text-purple-700 font-bold bg-purple-50/50"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={layoutId}
                                    className="absolute left-[-1px] top-0 bottom-0 w-[3px] bg-purple-600 rounded-r-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            {section.title}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}