"use client";

import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

export const REVEAL_BLOCK_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const FADE_UP_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const STAGGER_CONTAINER_VARIANTS: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

export function ScrollReveal({
    children,
    className,
    delay,
    amount,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    amount?: number | "some" | "all";
}) {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) {
        return <div className={className}>{children}</div>;
    }
    return (
        <motion.div
            className={className}
            variants={REVEAL_BLOCK_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: amount ?? 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: delay ?? 0 }}
        >
            {children}
        </motion.div>
    );
}

export function ScrollRevealList({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) {
        return <div className={className}>{children}</div>;
    }
    return (
        <motion.div
            className={className}
            variants={STAGGER_CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            {children}
        </motion.div>
    );
}

export function ScrollRevealItem({
    children,
    className,
    variants,
}: {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
}) {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) {
        return <div className={className}>{children}</div>;
    }
    return (
        <motion.div className={className} variants={variants ?? FADE_UP_VARIANTS}>
            {children}
        </motion.div>
    );
}
