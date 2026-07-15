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
      title="Edit project unavailable"
      description="We couldn't load the project editor. Please try again."
      error={error}
      reset={reset}
    />
  );
}