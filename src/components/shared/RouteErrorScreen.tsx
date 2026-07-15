"use client";

import * as React from "react";

import { Button } from "@/components/ui/forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";

export function RouteErrorScreen({
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again.",
  error,
  reset,
}: {
  title?: string;
  description?: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const details =
    process.env.NODE_ENV === "development"
      ? error.message || "Unknown error"
      : null;

  return (
    <main className="min-h-[70vh] bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {details ? (
              <div className="rounded-lg border bg-card px-4 py-3 text-sm">
                <p className="font-medium text-primary">Details</p>
                <p className="mt-1 break-words text-muted-foreground">{details}</p>
                {error.digest ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Digest: {error.digest}
                  </p>
                ) : null}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={reset}>Retry</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

