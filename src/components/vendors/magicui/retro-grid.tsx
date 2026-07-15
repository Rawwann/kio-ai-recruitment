"use client";

import { cn } from "@/lib/utils";
import { RetroGridProps } from "@/types";

export function RetroGrid({
    className,
    angle = 65,
    cellSize = 60,
    opacity = 0.5,
    lightLineColor = "gray",
    darkLineColor = "gray",
}: RetroGridProps) {
    const gridStyles = {
        "--grid-angle": `${angle}deg`,
        "--cell-size": `${cellSize}px`,
        "--opacity": opacity,
        "--light-line": lightLineColor,
        "--dark-line": darkLineColor,
    } as React.CSSProperties;

    return (
        <div
            className={cn(
                "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
                className,
            )}
            style={gridStyles}
        >
            {/* Grid */}
            <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
                <div
                    className={cn(
                        "animate-grid",
                        "[background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)]",
                        "[background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)]",
                        "dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]",
                        "inset-0 absolute h-[300%] w-full opacity-[var(--opacity)]",
                    )}
                />
            </div>

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
        </div>
    );
}

export default RetroGrid;
