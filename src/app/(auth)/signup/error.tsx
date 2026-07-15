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
      title="Signup unavailable"
      description="We couldn't load the signup page. Please try again."
      error={error}
      reset={reset}
    />
  );
}