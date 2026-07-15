"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8 space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-72" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}