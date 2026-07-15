"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * default: typical dashboards/lists
   * wide: analytics-heavy dashboards
   * narrow: auth/legal flows inside dashboard (rare)
   */
  width?: "default" | "wide" | "narrow";
  padding?: "default" | "none";
};

const widthClass: Record<NonNullable<PageShellProps["width"]>, string> = {
  default: "max-w-7xl",
  wide: "max-w-[1600px]",
  narrow: "max-w-4xl",
};

const paddingClass: Record<NonNullable<PageShellProps["padding"]>, string> = {
  default: "p-6 md:p-8",
  none: "",
};

export function PageShell({
  children,
  className,
  width = "default",
  padding = "default",
}: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full", widthClass[width], paddingClass[padding], className)}>
      {children}
    </div>
  );
}

