"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PasswordInput — a drop-in replacement for <Input type="password">
 * with an integrated visibility toggle (Eye / EyeOff).
 *
 * Supports all native input props and ref forwarding so it works
 * seamlessly with react-hook-form's `register()`.
 */
const PasswordInput = React.forwardRef<
    HTMLInputElement,
    Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="relative">
            <input
                ref={ref}
                type={showPassword ? "text" : "password"}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "pr-10", // extra right padding so text doesn't overlap with the toggle icon
                    className
                )}
                {...props}
            />
            <button
                type="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
