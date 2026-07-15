"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    process.env.NODE_ENV === "development"
      ? error.message || "Unknown error"
      : "Something went wrong. Please try again.";

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">We hit an error</CardTitle>
              <CardDescription>
                The app couldn’t complete your request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-card px-4 py-3 text-sm">
                <p className="font-medium text-primary">Details</p>
                <p className="mt-1 text-muted-foreground break-words">
                  {message}
                </p>
                {process.env.NODE_ENV === "development" && error.digest ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Digest: {error.digest}
                  </p>
                ) : null}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="flex w-full gap-2 sm:w-auto">
                <Button onClick={reset} className="w-full sm:w-auto">
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto"
                >
                  Reload
                </Button>
              </div>
              <Button asChild variant="ghost" className="w-full sm:w-auto">
                <Link href="/">Go to home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </body>
    </html>
  );
}