"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TIMELINE_EVENTS, TimelineEvent } from "@/lib/constants/dashboard/right-panel-data";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Extract the dot accent color from a tagColor utility string. */
function dotColorFromTag(tagColor: string): string {
    if (tagColor.includes("indigo"))  return "bg-indigo-500";
    if (tagColor.includes("purple"))  return "bg-purple-500";
    if (tagColor.includes("emerald")) return "bg-emerald-500";
    if (tagColor.includes("rose"))    return "bg-rose-500";
    if (tagColor.includes("amber"))   return "bg-amber-500";
    return "bg-slate-400";
}

/** Build an event lookup map keyed by "YYYY-M-D" (month 0-indexed). */
function buildEventMap(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of events) {
        const d = new Date(ev.dateISO);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(ev);
    }
    return map;
}

// ── Calendar grid cell ───────────────────────────────────────────────────────

interface CalendarCell {
    day: number;
    kind: "prev" | "curr" | "next";
}

function buildCells(year: number, month: number): CalendarCell[] {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth  = new Date(year, month + 1, 0).getDate();
    const daysInPrev   = new Date(year, month, 0).getDate();

    const cells: CalendarCell[] = [];

    // Leading days from previous month
    for (let i = 0; i < firstWeekday; i++) {
        cells.push({ day: daysInPrev - firstWeekday + 1 + i, kind: "prev" });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, kind: "curr" });
    }

    // Trailing days from next month (pad to 6 full rows = 42 cells)
    const trailing = 42 - cells.length;
    for (let i = 1; i <= trailing; i++) {
        cells.push({ day: i, kind: "next" });
    }

    return cells;
}

// ── Main component ────────────────────────────────────────────────────────────

export function DashboardCalendar() {
    const today = new Date();
    const [viewYear,  setViewYear]  = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
    const [selected,  setSelected]  = useState<{ day: number; events: TimelineEvent[] } | null>(null);

    const eventMap = buildEventMap(TIMELINE_EVENTS);
    const cells    = buildCells(viewYear, viewMonth);

    // ── Navigation ────────────────────────────────────────────────────────────
    const prevMonth = () => {
        setSelected(null);
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        setSelected(null);
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // ── Click handler ─────────────────────────────────────────────────────────
    const handleDayClick = (cell: CalendarCell) => {
        if (cell.kind !== "curr") return;

        const key    = `${viewYear}-${viewMonth}-${cell.day}`;
        const events = eventMap.get(key) ?? [];
        if (events.length === 0) { setSelected(null); return; }

        // Toggle: clicking the same day again hides the tooltip
        if (selected?.day === cell.day) { setSelected(null); }
        else { setSelected({ day: cell.day, events }); }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div>
            {/* Header ────────────────────────────────────────────────────── */}
            <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={prevMonth}
                        aria-label="Previous month"
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        aria-label="Next month"
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Weekday headers ────────────────────────────────────────────── */}
            <div className="grid grid-cols-7 text-center text-xs mb-1">
                {WEEKDAY_LABELS.map(label => (
                    <div key={label} className="text-slate-500 font-medium py-1">
                        {label}
                    </div>
                ))}
            </div>

            {/* Day grid ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((cell, idx) => {
                    const isToday =
                        cell.kind === "curr" &&
                        cell.day === today.getDate() &&
                        viewMonth === today.getMonth() &&
                        viewYear  === today.getFullYear();

                    const eventKey = `${viewYear}-${viewMonth}-${cell.day}`;
                    const dayEvents = cell.kind === "curr" ? (eventMap.get(eventKey) ?? []) : [];
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selected?.day === cell.day && cell.kind === "curr";

                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => handleDayClick(cell)}
                                className={cn(
                                    "flex items-center justify-center h-8 w-8 rounded-full text-[13px] transition-colors",
                                    // Today — always purple
                                    isToday && "bg-purple-600 text-white font-semibold shadow-sm",
                                    // Selected (with events) — light highlight
                                    isSelected && !isToday && "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
                                    // Current month, normal
                                    !isToday && !isSelected && cell.kind === "curr" &&
                                        "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                                    // Adjacent month days (greyed out)
                                    cell.kind !== "curr" && "text-slate-300 dark:text-slate-600",
                                    // Pointer only for days with events
                                    hasEvents ? "cursor-pointer" : "cursor-default",
                                )}
                                aria-label={cell.kind === "curr" ? `${MONTH_NAMES[viewMonth]} ${cell.day}` : undefined}
                            >
                                {cell.day}
                            </button>

                            {/* Event dots */}
                            {hasEvents && (
                                <div className="flex gap-0.5 mt-0.5 h-1.5">
                                    {dayEvents.map((ev, ei) => (
                                        <span
                                            key={ei}
                                            className={cn(
                                                "inline-block w-1.5 h-1.5 rounded-full",
                                                dotColorFromTag(ev.tagColor),
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Inline event detail tooltip ───────────────────────────────── */}
            {selected && (
                <div className="mt-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-3 space-y-2.5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {MONTH_NAMES[viewMonth]} {selected.day}
                    </p>
                    {selected.events.map((ev, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <span
                                className={cn(
                                    "shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded",
                                    ev.tagColor,
                                )}
                            >
                                {ev.time.split(" - ")[1] ?? ev.time}
                            </span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">
                                {ev.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
