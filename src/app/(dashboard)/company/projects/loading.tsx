"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8 space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full md:w-80" />
        <Skeleton className="h-10 w-full md:w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}