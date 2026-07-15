"use client";

import * as React from "react";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading KIO...</span>
      
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-[#5b21b6]/20 border-t-[#5b21b6] md:h-28 md:w-28" />

        <div className="relative animate-bounce-slow flex items-center justify-center rounded-full bg-background p-2">
          <img
            src="/logo.svg"
            alt="KIO Logo"
            className="h-14 w-14 shrink-0 transition-transform md:h-16 md:w-16"
            style={{
              animation: "pulse-scale 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}