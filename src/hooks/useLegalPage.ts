"use client";

import { useEffect, useState } from "react";
import { LegalSection } from "../types/legal";

export function useLegalPage(sections: LegalSection[]) {
    const [activeSection, setActiveSection] = useState(sections[0].id);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Show/hide scroll-to-top button based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Track which section is currently in view via IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter(e => e.isIntersecting);
                if (visibleEntries.length > 0) {
                    // Sort by top coordinate — topmost visible section wins
                    visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                    setActiveSection(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0px -60% 0px", // triggers when element crosses top 20% mark
                threshold: 0
            }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
        activeSection,
        showScrollTop,
        scrollToSection,
        scrollToTop,
    };
}