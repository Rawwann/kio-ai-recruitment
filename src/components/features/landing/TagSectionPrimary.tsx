import { Badge } from "@/components/ui/data-display/badge";

// ──────────────────────────────────────────────────────────────────
// TagSectionPrimary
// Shared section label badge used across the entire landing folder.
// Previously exported from FeaturesSection.tsx — now lives here.
// All landing sections must update their import to point to this file.
//
// Import map for files that previously imported from FeaturesSection:
//   ComparisonSection.tsx  → import { TagSectionPrimary } from "@/components/landing/components/TagSectionPrimary"
//   FaqSection.tsx         → import { TagSectionPrimary } from "@/components/landing/components/TagSectionPrimary"
//   HowItWorksSection.tsx  → import { TagSectionPrimary } from "@/components/landing/components/TagSectionPrimary"
//   PricingSection.tsx     → import { TagSectionPrimary } from "@/components/landing/components/TagSectionPrimary"
// ──────────────────────────────────────────────────────────────────
export const TagSectionPrimary = ({
    label,
    whiteText = false,
}: {
    label: string;
    whiteText?: boolean;
}) => (
    <Badge
        variant="outline"
        className={`
      inline-flex items-center justify-center px-4 py-1 h-[28px] rounded-full border
      /* Dynamic theme application: Light variant for dark backgrounds, purple variant for light backgrounds */
      ${whiteText
                ? "border-white/30 bg-white/10 text-white"
                : "border-purple-200 bg-purple-50/30 text-purple-900"}
      text-[10px] font-bold uppercase tracking-widest mb-4
    `}
    >
        {label}
    </Badge>
);