import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandGithub, IconBrandDribbble } from "@tabler/icons-react";
import { KioLogoText } from "@/components/shared/KIOLogoText";

const navLinks = [
    {
        title: "Product",
        links: [
            { id: "features", label: "Features", href: "/#features" },
            { id: "comparison", label: "Comparison", href: "/#comparison" },
            { id: "how-it-works", label: "How it Works", href: "/#how-it-works" },
            { id: "pricing", label: "Pricing", href: "/#pricing" },
            { id: "faq", label: "FAQ", href: "/#faq" },
        ],
    },
    {
        title: "Company",
        links: [
            { id: "about", label: "About KIO", href: "/about" },
            { id: "blog", label: "Blog", href: "/blog" },
            { id: "careers", label: "Careers", href: "/careers" },
            { id: "contact", label: "Contact", href: "/#contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { id: "privacy-policy", label: "Privacy Policy", href: "/privacy-policy" },
            { id: "terms-and-conditions", label: "Terms & Conditions", href: "/terms-and-conditions" },
            { id: "cookie-policy", label: "Cookie Policy", href: "/cookie-policy" },
            { id: "security", label: "Security", href: "/security" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-white text-[#6C2BD9] px-6 sm:px-8 lg:px-10 pt-14 pb-8 border-t border-[#ede9fe]">

            {/* Glow effects */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(108,43,217,0.15)_0%,transparent_70%)] opacity-80" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(108,43,217,0.08)_0%,transparent_70%)]" />

            {/* Watermark */}
            <div className="pointer-events-none select-none absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[80px] sm:text-[130px] font-black tracking-[-4px] text-white/[0.025] whitespace-nowrap">
                KIO
            </div>

            {/* Main grid */}
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

                    {/* Brand column — full width on mobile */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
                            <Image src="/logo.svg" alt="KIO Logo" width={32} height={32} className="w-8 h-8" />
                            <KioLogoText className="text-2xl" />
                        </Link>
                        <p className="mb-6 max-w-[260px] text-sm leading-relaxed text-[#6b7280]">
                            Hire smarter. Evaluate candidates based on real performance, not just resumes.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-4">
                            <Link href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-200">
                                <IconBrandFacebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors duration-200">
                                <IconBrandInstagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-sky-500 transition-colors duration-200">
                                <IconBrandTwitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors duration-200">
                                <IconBrandGithub className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                                <IconBrandDribbble className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Nav columns */}
                    {navLinks.map(({ title, links }) => (
                        <div key={title} className="col-span-1">
                            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#111827]">
                                {title}
                            </h2>
                            <ul className="space-y-3">
                                {links.map(({ id, label, href }) => (
                                    <li key={id}>
                                        <Link
                                            href={href}
                                            className="text-sm text-[#6b7280] hover:text-[#6C2BD9] transition-colors duration-200"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <hr className="my-10 border-[#ede9fe]" />

                {/* Bottom bar */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-[#6b7280]">
                        © {new Date().getFullYear()}{" "}
                        <Link href="/" className="text-[#6b7280] transition-colors hover:text-[#9b8af8]">
                            KIO™
                        </Link>
                        . All Rights Reserved.
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="rounded-full border border-[#6e5bdc]/35 bg-[#6e5bdc]/08 px-2.5 py-1 text-[11px] text-[#6b7280]">
                            AI-Powered Hiring
                        </span>
                        <span className="rounded-full border border-[#6e5bdc]/35 bg-[#6e5bdc]/08 px-2.5 py-1 text-[11px] text-[#6b7280]">
                            v1.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}