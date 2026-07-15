"use client";

import { useRef, useState, useMemo, type ComponentProps } from "react";
import {
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";
import { ChartsSectionProps } from "@/types";
import { DONUT_DATA_BY_PERIOD, AREA_DATA_BY_RANGE } from "@/lib/constants/dashboard/chart-data";

const TRACK_COLORS = ["#7e22ce", "#d97706", "#a78bfa", "#6d28d9", "#c4b5fd", "#e8d5ff"];

function buildDonutFromApi(
    api: { name: string; value: number }[] | undefined,
    periodKey: string,
): { name: string; value: number; color: string }[] {
    const base = DONUT_DATA_BY_PERIOD[periodKey] ?? DONUT_DATA_BY_PERIOD["Month"];
    if (!api?.length) return base;
    const total = api.reduce((s, x) => s + (Number(x.value) || 0), 0) || 1;
    return api.map((x, i) => ({
        name: x.name,
        value: Math.round((Number(x.value) / total) * 100),
        color: TRACK_COLORS[i % TRACK_COLORS.length],
    }));
}

function buildAreaFromApi(
    api: { month: string; apps?: number; count?: number }[] | undefined,
    rangeKey: string,
): { month: string; apps: number }[] {
    const base = AREA_DATA_BY_RANGE[rangeKey] ?? AREA_DATA_BY_RANGE["Last 8 Months"];
    if (!api?.length) return base;
    return api.map((row) => ({
        month: row.month,
        apps: Number(row.apps ?? row.count ?? 0),
    }));
}
import { downloadChartAsPNG } from "@/lib/chart-export";
import { HeaderActions } from "./HeaderActions";

/** Matches Recharts Tooltip `formatter`: `value` may be undefined; do not narrow to `number` only. */
type PieTooltipFormatter = NonNullable<ComponentProps<typeof Tooltip>["formatter"]>;

const piePercentFormatter: PieTooltipFormatter = (value) => {
    const n =
        value === undefined || value === null
            ? 0
            : typeof value === "number"
                ? value
                : Number(value);
    return [`${Number.isFinite(n) ? n : 0}%`, ""];
};

export function ChartsSection({
    tracksMonth,
    setTracksMonth,
    appsRange,
    setAppsRange,
    tracksDistribution,
    applicationsOverTime,
}: ChartsSectionProps) {
    // ── Refs for PNG capture ─────────────────────────────────────────────────
    const tracksCardRef = useRef<HTMLDivElement>(null);
    const velocityCardRef = useRef<HTMLDivElement>(null);

    // ── Chart type toggle (Applications Velocity) ────────────────────────────
    const [velocityChartType, setVelocityChartType] = useState<"area" | "bar">("area");

    const donutData = useMemo(
        () => buildDonutFromApi(tracksDistribution, tracksMonth),
        [tracksDistribution, tracksMonth],
    );
    const areaData = useMemo(
        () => buildAreaFromApi(applicationsOverTime, appsRange),
        [applicationsOverTime, appsRange],
    );

    // ── Action handlers ──────────────────────────────────────────────────────
    async function handleTracksDownload() {
        if (!tracksCardRef.current) { toast.error("Chart not ready"); return; }
        toast.info("Downloading…");
        try {
            await downloadChartAsPNG(tracksCardRef.current, "tracks-distribution.png");
        } catch (err) {
            console.error("[Tracks] download error:", err);
            toast.error("Download failed — check browser console");
        }
    }

    async function handleVelocityDownload() {
        if (!velocityCardRef.current) { toast.error("Chart not ready"); return; }
        toast.info("Downloading…");
        try {
            await downloadChartAsPNG(velocityCardRef.current, "applications-velocity.png");
        } catch (err) {
            console.error("[Velocity] download error:", err);
            toast.error("Download failed — check browser console");
        }
    }

    function handleChangeChartType() {
        setVelocityChartType((prev) => (prev === "area" ? "bar" : "area"));
        toast.info(
            velocityChartType === "area"
                ? "Switched to Bar Chart"
                : "Switched to Area Chart",
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Tracks Distribution ───────────────────────────────────────── */}
            <div ref={tracksCardRef}>
                <Card className="col-span-1 border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            Tracks Distribution
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Select value={tracksMonth} onValueChange={setTracksMonth}>
                                <SelectTrigger className="h-8 text-xs font-medium border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 w-[90px]">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                    <SelectItem value="Month">Month</SelectItem>
                                    <SelectItem value="Week">Week</SelectItem>
                                    <SelectItem value="Year">Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <HeaderActions
                                variant="tracks"
                                onDownloadPng={handleTracksDownload}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center pb-6">
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
                                            background: "#fff",
                                        }}
                                        itemStyle={{ color: "#1e293b", fontWeight: 600 }}
                                        formatter={piePercentFormatter}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-sm font-semibold text-slate-400">Applicants</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-2 w-full">
                            {donutData.map((entry, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-sm"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-xs text-slate-500 font-medium">{entry.name}</span>
                                    </div>
                                    <span className="text-base font-bold text-slate-900 dark:text-white">
                                        {entry.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Applications Velocity ─────────────────────────────────────── */}
            <div ref={velocityCardRef} className="col-span-1 lg:col-span-2">
                <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl flex flex-col pt-2 h-full">
                    <CardHeader className="flex flex-row items-start lg:items-center justify-between pb-6">
                        <div className="flex flex-col gap-1.5">
                            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                Applications Velocity
                            </CardTitle>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" />
                                    <span>Applications</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-[#7e22ce]" />
                                    <span>Trend</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={appsRange} onValueChange={setAppsRange}>
                                <SelectTrigger className="h-8 text-xs font-medium border-slate-200 bg-slate-50 rounded-lg hover:bg-slate-100 w-[140px]">
                                    <SelectValue placeholder="Last 8 Months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-white dark:bg-neutral-900 shadow-lg border border-slate-100 dark:border-slate-800">
                                    <SelectItem value="Last 8 Months">Last 8 Months</SelectItem>
                                    <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                                    <SelectItem value="This Year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <HeaderActions
                                variant="velocity"
                                onDownloadPng={handleVelocityDownload}
                                onChangeChartType={handleChangeChartType}
                                chartTypeLabel={
                                    velocityChartType === "area"
                                        ? "Switch to Bar Chart"
                                        : "Switch to Area Chart"
                                }
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="h-[260px] w-full px-2 pb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            {velocityChartType === "area" ? (
                                <AreaChart
                                    data={areaData}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#7e22ce" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                                        tickFormatter={(val) => (val >= 1000 ? `${val / 1000}K` : val)}
                                    />
                                    <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
                                            background: "#fff",
                                        }}
                                        itemStyle={{ color: "#7e22ce", fontWeight: 600 }}
                                    />
                                    {/* Lighter wave overlay */}
                                    <Area
                                        type="monotone"
                                        dataKey="apps"
                                        stroke="#e8d5ff"
                                        strokeWidth={4}
                                        fillOpacity={0}
                                        className="translate-y-4"
                                        isAnimationActive={false}
                                    />
                                    {/* Main wave */}
                                    <Area
                                        type="monotone"
                                        dataKey="apps"
                                        stroke="#7e22ce"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorApps)"
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart
                                    data={areaData}
                                    barSize={28}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                                        tickFormatter={(val) => (val >= 1000 ? `${val / 1000}K` : val)}
                                    />
                                    <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="0" />
                                    <Tooltip
                                        cursor={{ fill: "#f8fafc" }}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
                                            background: "#fff",
                                        }}
                                        itemStyle={{ color: "#7e22ce", fontWeight: 600 }}
                                    />
                                    <Bar
                                        dataKey="apps"
                                        fill="#7e22ce"
                                        radius={[6, 6, 0, 0]}
                                        background={{ fill: "#f8fafc", radius: 6 }}
                                    />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
