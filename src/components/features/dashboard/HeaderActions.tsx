"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/navigation/dropdown-menu";
import {
    MoreHorizontal,
    Download,
    BarChart2,
    AreaChart as AreaChartIcon,
    List,
    Database,
    Users,
    FileText,
} from "lucide-react";

export type HeaderActionsVariant =
    | "tracks"
    | "velocity"
    | "funnel"
    | "performers"
    | "default";

interface HeaderActionsProps {
    variant?: HeaderActionsVariant;

    // ── PNG download (tracks, velocity, funnel) ─────────────────────
    onDownloadPng?: () => void;

    // ── Tracks ──────────────────────────────────────────────────────
    /** Navigate to the full breakdown view */
    onViewBreakdown?: () => void;

    // ── Velocity ────────────────────────────────────────────────────
    /** Toggle between AreaChart and BarChart */
    onChangeChartType?: () => void;
    /** Label shown in the menu — changes as chart type toggles */
    chartTypeLabel?: string;

    // ── Funnel ──────────────────────────────────────────────────────
    /** Export funnel data as CSV */
    onExportFunnelData?: () => void;

    // ── Performers ──────────────────────────────────────────────────
    /** Navigate to /company/candidates */
    onViewAll?: () => void;
    /** Export performers list as CSV */
    onExportList?: () => void;
}

// ── Tracks Distribution ───────────────────────────────────────────────────────
function TracksActions({
    onDownloadPng,
    onViewBreakdown,
}: Pick<HeaderActionsProps, "onDownloadPng" | "onViewBreakdown">) {
    return (
        <>
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onDownloadPng}
            >
                <Download className="h-4 w-4" />
                Download as PNG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* TODO: navigate to /company/projects?view=breakdown */}
            <DropdownMenuItem
                className="gap-2 cursor-not-allowed opacity-60"
                disabled
                onSelect={onViewBreakdown}
            >
                <List className="h-4 w-4" />
                View full breakdown
            </DropdownMenuItem>
        </>
    );
}

// ── Applications Velocity ─────────────────────────────────────────────────────
function VelocityActions({
    onDownloadPng,
    onChangeChartType,
    chartTypeLabel = "Switch to Bar Chart",
}: Pick<HeaderActionsProps, "onDownloadPng" | "onChangeChartType" | "chartTypeLabel">) {
    return (
        <>
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onDownloadPng}
            >
                <Download className="h-4 w-4" />
                Download as PNG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onChangeChartType}
            >
                {chartTypeLabel.startsWith("Switch to Bar") ? (
                    <BarChart2 className="h-4 w-4" />
                ) : (
                    <AreaChartIcon className="h-4 w-4" />
                )}
                {chartTypeLabel}
            </DropdownMenuItem>
        </>
    );
}

// ── Hiring Funnel ─────────────────────────────────────────────────────────────
function FunnelActions({
    onDownloadPng,
    onExportFunnelData,
}: Pick<HeaderActionsProps, "onDownloadPng" | "onExportFunnelData">) {
    return (
        <>
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onDownloadPng}
            >
                <Download className="h-4 w-4" />
                Download as PNG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onExportFunnelData}
            >
                <Database className="h-4 w-4" />
                Export data
            </DropdownMenuItem>
        </>
    );
}

// ── Top Performers ────────────────────────────────────────────────────────────
function PerformersActions({
    onViewAll,
    onExportList,
}: Pick<HeaderActionsProps, "onViewAll" | "onExportList">) {
    return (
        <>
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onViewAll}
            >
                <Users className="h-4 w-4" />
                View all
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onSelect={onExportList}
            >
                <FileText className="h-4 w-4" />
                Export list
            </DropdownMenuItem>
        </>
    );
}

// ── Public component ──────────────────────────────────────────────────────────
export function HeaderActions({
    variant = "default",
    onDownloadPng,
    onViewBreakdown,
    onChangeChartType,
    chartTypeLabel = "Switch to Bar Chart",
    onExportFunnelData,
    onViewAll,
    onExportList,
}: HeaderActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[200px] rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800"
            >
                {variant === "tracks" && (
                    <TracksActions
                        onDownloadPng={onDownloadPng}
                        onViewBreakdown={onViewBreakdown}
                    />
                )}
                {variant === "velocity" && (
                    <VelocityActions
                        onDownloadPng={onDownloadPng}
                        onChangeChartType={onChangeChartType}
                        chartTypeLabel={chartTypeLabel}
                    />
                )}
                {variant === "funnel" && (
                    <FunnelActions
                        onDownloadPng={onDownloadPng}
                        onExportFunnelData={onExportFunnelData}
                    />
                )}
                {variant === "performers" && (
                    <PerformersActions
                        onViewAll={onViewAll}
                        onExportList={onExportList}
                    />
                )}
                {variant === "default" && (
                    <>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onSelect={onViewAll}
                        >
                            <Users className="h-4 w-4" />
                            View all
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onSelect={onExportList}
                        >
                            <FileText className="h-4 w-4" />
                            Export list
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
