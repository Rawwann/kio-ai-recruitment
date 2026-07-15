import React from 'react';
import { Navbar1 } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar1 />
            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}