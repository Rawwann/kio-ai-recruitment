"use client";

import { motion } from "framer-motion";
import { FeatureBlock } from "@/components/features/landing/FeatureBlock";
import { featureBlocks } from "@/lib/constants/landing/feature-blocks";
import { FADE_UP_VARIANTS } from "@/lib/animations";

// ──────────────────────────────────────────────────────────────────
// Re-exports for backward compatibility
// ──────────────────────────────────────────────────────────────────
export { ButtonLink } from "@/components/features/landing/ButtonLink";
export { TagSectionPrimary } from "@/components/features/landing/TagSectionPrimary";

// ──────────────────────────────────────────────────────────────────
// FeaturesSection
// ──────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section className="w-full relative overflow-hidden py-24 bg-transparent">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        {featureBlocks.map((block, i) => (
          <motion.div key={i} variants={FADE_UP_VARIANTS}>
            <FeatureBlock {...block} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}