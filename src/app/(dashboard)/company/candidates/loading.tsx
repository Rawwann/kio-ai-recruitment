"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8 space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full md:w-80" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Skeleton className="h-[520px] w-full rounded-xl" />
    </div>
  );
}