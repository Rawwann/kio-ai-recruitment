"use client";

import * as React from "react";
import { RouteErrorScreen } from "@/components/shared/RouteErrorScreen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorScreen
      title="Create project unavailable"
      description="We couldn't load the project creation page. Please try again."
      error={error}
      reset={reset}
    />
  );
}