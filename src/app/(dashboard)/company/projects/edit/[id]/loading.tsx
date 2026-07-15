"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-8 space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  );
}