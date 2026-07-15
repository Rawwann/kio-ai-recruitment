"use client";

import { useLegalPage } from "@/hooks/useLegalPage";
import { TERMS_SECTIONS } from "@/lib/constants/landing/terms-sections";
import { LegalPageHero } from "@/components/features/legal/LegalPageHero";
import { LegalSidebarNav } from "@/components/features/legal/LegalSidebarNav";
import { LegalContentCard } from "@/components/features/legal/LegalContentCard";
import { ScrollToTopButton } from "@/components/features/legal/ScrollToTopButton";

// ──────────────────────────────────────────────────────────────────
// TermsAndConditions — page shell only
// All scroll logic lives in useLegalPage.
// All UI lives in the four shared components below.
// Page-specific values (title, layoutIds, trust text, cross-link)
// are passed as props.
// ──────────────────────────────────────────────────────────────────
export function TermsAndConditions() {
    const { activeSection, showScrollTop, scrollToSection, scrollToTop } =
        useLegalPage(TERMS_SECTIONS);

    return (
        <div className="min-h-screen w-full bg-transparent font-sans">
            <LegalPageHero
                title="Terms & Conditions"
                breadcrumbLabel="Terms & Conditions"
                lastUpdated="Last Updated: March 10, 2026"
            />

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 pb-24 relative z-10 -mt-10">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    <LegalSidebarNav
                        sections={TERMS_SECTIONS}
                        activeSection={activeSection}
                        onNavigate={scrollToSection}
                        layoutId="activeTermsIndicator"
                    />
                    <LegalContentCard
                        sections={TERMS_SECTIONS}
                        activeSection={activeSection}
                        trustBannerText="We believe in transparency. These terms outline your rights and responsibilities to ensure a fair and secure experience on KIO."
                        crossLinkHref="/privacy-policy"
                        crossLinkLabel="Privacy Policy"
                        sectionLayoutId="activeTermsSectionHeader"
                        renderList={false}
                    />
                </div>
            </div>

            <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
        </div>
    );
}