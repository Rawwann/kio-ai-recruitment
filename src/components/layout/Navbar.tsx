"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/forms/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/layout/sheet";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { KioLogoText } from "@/components/shared/KIOLogoText";

const navLinks = [
    { id: "features", label: "Features", href: "/#features" },
    { id: "comparison", label: "Comparison", href: "/#comparison" },
    { id: "how-it-works", label: "How it Works", href: "/#how-it-works" },
    { id: "pricing", label: "Pricing", href: "/#pricing" },
    { id: "faq", label: "FAQ", href: "/#faq" },
    { id: "contact", label: "Contact", href: "/#contact" },
];

export function Navbar1() {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== "/") return;

        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px",
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll("div[id], section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl rounded-2xl transition-all duration-300 bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-purple-900/5">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">

                {/* Brand */}
                <Link
                    href="/"
                    prefetch={true}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-2"
                >
                    <Image src="/logo.svg" alt="KIO Logo" width={36} height={36} />
                    <KioLogoText className="text-lg sm:text-xl" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id && pathname === "/";
                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                prefetch={true}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${isActive
                                        ? "text-purple-700 bg-purple-50/50 shadow-sm"
                                        : "text-gray-600 hover:text-purple-700"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* CTA + Mobile Toggle */}
                <div className="flex items-center gap-2">

                    {/* Desktop Login */}
                    <Button
                        variant="outline"
                        className="hidden md:inline-flex kio-btn-login rounded-lg px-5"
                        asChild
                    >
                        <Link href="/login" prefetch={true}>Login</Link>
                    </Button>

                    {/* Desktop Sign Up */}
                    <Button
                        className="hidden md:inline-flex kio-btn-ai-primary rounded-lg px-5"
                        asChild
                    >
                        <Link href="/signup" prefetch={true}>Sign Up</Link>
                    </Button>

                    {/* Mobile Drawer */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <IconMenu2 className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 pt-10">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => {
                                    const isActive = activeSection === link.id && pathname === "/";
                                    return (
                                        <Link
                                            key={link.id}
                                            href={link.href}
                                            prefetch={true}
                                            onClick={() => setOpen(false)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                                    ? "text-purple-700 bg-purple-50"
                                                    : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                {/* Mobile Login */}
                                <Button
                                    variant="outline"
                                    className="mt-4 kio-btn-login w-full rounded-lg"
                                    asChild
                                >
                                    <Link href="/login" prefetch={true}>Login</Link>
                                </Button>

                                {/* Mobile Sign Up */}
                                <Button
                                    className="mt-2 kio-btn-ai-primary w-full rounded-lg"
                                    asChild
                                >
                                    <Link href="/signup" prefetch={true}>Sign Up</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </nav>
    );
}