"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/forms/button";

const DEEP_PURPLE = "#7e22ce";
const DEEP_PURPLE_HOVER = "#6b21a8";

function NotFoundIllustration() {
  return (
    <div className="w-full max-w-[320px] md:max-w-[400px]">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <circle cx="250" cy="250" r="200" fill="#faf5ff" />
        <circle cx="250" cy="250" r="150" fill="#f3e8ff" />
        
        <rect x="180" y="180" width="140" height="160" rx="40" fill={DEEP_PURPLE} />
        <circle cx="250" cy="180" r="60" fill={DEEP_PURPLE} />
        
        <rect x="200" y="150" width="100" height="60" rx="30" fill="#e9d5ff" />
        
        <circle cx="100" cy="100" r="10" fill={DEEP_PURPLE} className="animate-pulse" />
        <circle cx="400" cy="150" r="6" fill="#7c3aed" className="animate-pulse" />
        <circle cx="420" cy="350" r="8" fill="#8b5cf6" className="animate-pulse" />
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 transform hover:rotate-2 transition-transform duration-500">
        <NotFoundIllustration />
      </div>

      <div className="space-y-4">
        <h1 
          className="text-8xl md:text-9xl font-extrabold tracking-tighter drop-shadow-lg"
          style={{ color: DEEP_PURPLE }}
        >
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
          Oops! You've drifted into the purple void.
        </h2>
        
        <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">
          The page you're searching for is currently floating in another dimension. 
          Let's get you back to the KIO home base.
        </p>
      </div>

      <div className="mt-10">
        <Link href="/">
          <Button 
            size="lg" 
            className="px-10 h-14 text-lg text-white transition-all hover:scale-105 rounded-full border-none shadow-lg"
            style={{ 
              backgroundColor: DEEP_PURPLE,
              '--hover-bg': DEEP_PURPLE_HOVER 
            } as React.CSSProperties}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = DEEP_PURPLE_HOVER)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = DEEP_PURPLE)}
          >
            Take Me Home
          </Button>
        </Link>
      </div>

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,#f5f0ff_0%,transparent_100%)]" />
    </main>
  );
}