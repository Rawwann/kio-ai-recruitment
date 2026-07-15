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
      title="Reset password unavailable"
      description="We couldn't load the reset password flow. Please try again."
      error={error}
      reset={reset}
    />
  );
}