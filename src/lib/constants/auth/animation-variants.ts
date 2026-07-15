import { Variants } from "framer-motion";

export const ITEM_VARIANTS: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        height: 0,
        overflow: 'hidden'
    },
    visible: {
        opacity: 1,
        scale: 1,
        height: 'auto',
        overflow: 'visible',
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        height: 0,
        overflow: 'hidden',
        transition: { duration: 0.2 }
    }
};


// ──────────────────────────────────────────────────────────────────
// Shared Animation Variants
// Previously duplicated verbatim in:
//   - candidates/[id]/page.tsx
//   - projects/[id]/page.tsx
// Both pages import from here going forward.
// ──────────────────────────────────────────────────────────────────

export const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};