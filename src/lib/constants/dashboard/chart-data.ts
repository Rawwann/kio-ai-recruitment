export interface DonutDataItem {
    name: string;
    value: number;
    color: string;
}

export interface AreaDataItem {
    month: string;
    apps: number;
}

/** Fallback only when the API sends no series yet (no fabricated business metrics). */
export const DONUT_DATA_BY_PERIOD: Record<string, DonutDataItem[]> = {
    Month: [
        { name: "—", value: 0, color: "#e8d5ff" },
    ],
    Week: [
        { name: "—", value: 0, color: "#e8d5ff" },
    ],
    Year: [
        { name: "—", value: 0, color: "#e8d5ff" },
    ],
};

export const DONUT_DATA = DONUT_DATA_BY_PERIOD["Month"];

export const AREA_DATA_BY_RANGE: Record<string, AreaDataItem[]> = {
    "Last 8 Months": [{ month: "—", apps: 0 }],
    "Last 6 Months": [{ month: "—", apps: 0 }],
    "This Year": [{ month: "—", apps: 0 }],
};

export const AREA_DATA = AREA_DATA_BY_RANGE["Last 8 Months"];
