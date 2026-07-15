"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-56" />
      </div>
      <Skeleton className="h-[640px] w-full rounded-2xl" />
    </div>
  );
}