"use client";

import { useLegalPage } from "@/hooks/useLegalPage";
import { PRIVACY_SECTIONS } from "@/lib/constants/landing/privacy-sections";
import { LegalPageHero } from "@/components/features/legal/LegalPageHero";
import { LegalSidebarNav } from "@/components/features/legal/LegalSidebarNav";
import { LegalContentCard } from "@/components/features/legal/LegalContentCard";
import { ScrollToTopButton } from "@/components/features/legal/ScrollToTopButton";

// ──────────────────────────────────────────────────────────────────
// PrivacyPolicy — page shell only
// All scroll logic lives in useLegalPage.
// All UI lives in the four shared components below.
// Page-specific values (title, layoutIds, trust text, cross-link)
// are passed as props.
// ──────────────────────────────────────────────────────────────────
export function PrivacyPolicy() {
    const { activeSection, showScrollTop, scrollToSection, scrollToTop } =
        useLegalPage(PRIVACY_SECTIONS);

    return (
        <div className="min-h-screen w-full bg-transparent font-sans">
            <LegalPageHero
                title="Privacy Policy"
                breadcrumbLabel="Privacy Policy"
                lastUpdated="Last Updated: March 10, 2026"
            />

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 pb-24 relative z-10 -mt-10">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    <LegalSidebarNav
                        sections={PRIVACY_SECTIONS}
                        activeSection={activeSection}
                        onNavigate={scrollToSection}
                        layoutId="activePrivacyIndicator"
                    />
                    <LegalContentCard
                        sections={PRIVACY_SECTIONS}
                        activeSection={activeSection}
                        trustBannerText="Your privacy matters to us. We are committed to protecting your professional data and being transparent about how we use it."
                        crossLinkHref="/terms-and-conditions"
                        crossLinkLabel="Terms & Conditions"
                        sectionLayoutId="activePrivacySectionHeader"
                        renderList={true}
                    />
                </div>
            </div>

            <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
        </div>
    );
}