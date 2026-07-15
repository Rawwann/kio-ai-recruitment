"use client";

import { useRef, useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppNotification {
    id: string;
    title: string;
    createdAt: string; // ISO date string
}

interface NotificationBellProps {
    /** Notification items to display. Empty array → "No new notifications". */
    notifications?: AppNotification[];
    /** Extra classes on the outermost wrapper div (position: relative). */
    className?: string;
    /** Replaces the default button classes entirely when provided. */
    buttonClassName?: string;
    /** Replaces the indicator dot classes entirely when provided. */
    dotClassName?: string;
    /** Classes forwarded to the <Bell> icon. */
    iconClassName?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NotificationBell({
    notifications = [],
    className,
    buttonClassName,
    dotClassName,
    iconClassName,
}: NotificationBellProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close panel on outside click
    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    const hasNotifications = notifications.length > 0;

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* ── Trigger button ──────────────────────────────────────── */}
            <button
                type="button"
                aria-label="Open notifications"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-full text-slate-500",
                    "hover:bg-slate-100 hover:text-purple-600 dark:text-slate-400 dark:hover:bg-slate-800",
                    "transition-colors shrink-0 relative",
                    buttonClassName,
                )}
            >
                <Bell className={cn("w-5 h-5 flex-shrink-0", iconClassName)} />

                {/* Indicator dot — always visible (static red like the original design) */}
                <span
                    className={cn(
                        "absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full",
                        "border-2 border-white dark:border-slate-950",
                        dotClassName,
                    )}
                />
            </button>

            {/* ── Dropdown panel ──────────────────────────────────────── */}
            {open && (
                <div
                    role="dialog"
                    aria-label="Notifications panel"
                    className={cn(
                        "absolute right-0 top-[calc(100%+8px)] z-50 w-80",
                        "rounded-xl border border-slate-200 bg-white shadow-xl",
                        "dark:border-slate-700 dark:bg-neutral-900",
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            Notifications
                        </p>
                        {hasNotifications && (
                            <span className="text-xs bg-rose-100 text-rose-600 rounded-full px-2 py-0.5 font-medium">
                                {notifications.length} new
                            </span>
                        )}
                    </div>

                    {/* Body */}
                    {hasNotifications ? (
                        <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-snug">
                                        {n.title}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-10 flex flex-col items-center justify-center gap-2">
                            <Bell className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                No new notifications
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
