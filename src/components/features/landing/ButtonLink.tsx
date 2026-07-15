import type { CSSProperties, ComponentPropsWithoutRef } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Landing primary CTA — matches Hero "Watch your Demo" / CTA "Book a Demo"
// ─────────────────────────────────────────────────────────────────────────────

export const LANDING_PRIMARY_GRADIENT: CSSProperties = {
    background:
        "linear-gradient(171deg, rgba(199, 125, 255, 1) 0%, rgba(157, 78, 221, 1) 52%, rgba(224, 170, 255, 1) 100%)",
};

const sizeStyles = {
    md: {
        root: "min-h-12 h-12 px-5 text-[15px] md:text-base",
        iconWrap: "h-8 w-8 rounded-lg",
        icon: "h-4 w-4",
    },
    lg: {
        root: "min-h-14 h-14 px-6 text-[16px] md:text-[17px]",
        iconWrap: "h-9 w-9 rounded-lg",
        icon: "h-5 w-5",
    },
} as const;

export type LandingCtaSize = keyof typeof sizeStyles;

/** `between` = label + chevron at ends; `cluster` = label + chevron grouped and centered in the pill */
export type ButtonLinkContentLayout = "between" | "cluster";

export interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
    text: string;
    size?: LandingCtaSize;
    fullWidth?: boolean;
    /** Show trailing chevron (default true). Hero / features keep true; comparison, pricing, CTA often use false. */
    showIcon?: boolean;
    /** When `showIcon` is true: default `between`; full-width defaults to `cluster` unless overridden */
    contentLayout?: ButtonLinkContentLayout;
}

export function ButtonLink({
    text,
    size = "md",
    fullWidth = false,
    showIcon = true,
    contentLayout: contentLayoutProp,
    className,
    type = "button",
    ...rest
}: ButtonLinkProps) {
    const s = sizeStyles[size];
    const contentLayout: ButtonLinkContentLayout =
        contentLayoutProp ?? (fullWidth ? "cluster" : "between");
    const isCluster = contentLayout === "cluster";

    return (
        <button
            type={type}
            style={LANDING_PRIMARY_GRADIENT}
            className={cn(
                "group relative inline-flex cursor-pointer items-center rounded-xl border-0 font-bold tracking-tight text-white shadow-lg",
                showIcon
                    ? isCluster
                        ? "justify-center gap-3"
                        : "justify-between gap-3"
                    : "justify-center",
                "transition-all duration-200 hover:opacity-95 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white/80",
                "disabled:pointer-events-none disabled:opacity-50",
                s.root,
                fullWidth && "w-full",
                !fullWidth && "w-fit min-w-[12.5rem]",
                className,
            )}
            {...rest}
        >
            {showIcon ? (
                <>
                    <span
                        className={cn(
                            "z-10 min-w-0 truncate",
                            !isCluster && "flex-1 pr-2",
                            !isCluster && fullWidth && "text-center",
                            !isCluster && !fullWidth && "text-left",
                            isCluster && "text-center",
                        )}
                    >
                        {text}
                    </span>
                    <span
                        className={cn(
                            "z-10 flex shrink-0 items-center justify-center bg-white/20 transition-colors group-hover:bg-white/30",
                            s.iconWrap,
                        )}
                        aria-hidden
                    >
                        <IconChevronRight
                            className={cn(
                                "text-white transition-transform duration-300 group-hover:translate-x-0.5",
                                s.icon,
                            )}
                        />
                    </span>
                </>
            ) : (
                <span className="z-10 min-w-0 truncate text-center">{text}</span>
            )}
        </button>
    );
}
