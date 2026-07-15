/**
 * Shared utilities for chart actions:
 *   downloadChartAsPNG  – captures a DOM element as PNG via dom-to-image-more
 *   exportToCSV         – converts a data array to a downloadable CSV file
 *
 * dom-to-image-more is used instead of html2canvas because html2canvas does
 * not support modern CSS color functions (lab, oklch, lch, color()) that
 * Tailwind v4 / shadcn emit — causing a crash at capture time.
 */

/** Minimal type shim — dom-to-image-more ships no bundled .d.ts */
interface DomToImage {
    toBlob(node: HTMLElement, options?: Record<string, unknown>): Promise<Blob>;
}

/**
 * Captures `element` and triggers a PNG download named `filename`.
 *
 * Uses dom-to-image-more → toBlob → URL.createObjectURL so:
 *  1. Modern CSS colors (lab, oklch…) are handled correctly.
 *  2. Blob object-URLs are never blocked by the browser's download policy
 *     (unlike large data: URIs which Chrome silently drops).
 */
export async function downloadChartAsPNG(
    element: HTMLElement,
    filename: string,
): Promise<void> {
    // Dynamic import keeps this off the server bundle.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const domtoimage: DomToImage = require("dom-to-image-more");

    let blob: Blob;
    try {
        blob = await domtoimage.toBlob(element, {
            scale: 2,
            bgcolor: "#ffffff",
        });
    } catch (err) {
        console.error("[downloadChartAsPNG] dom-to-image-more error:", err);
        throw err;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Keep the URL alive long enough for the browser to start the download.
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Converts `data` to a CSV string and triggers a file download.
 * Column headers are derived from the keys of the first object.
 */
export function exportToCSV(
    filename: string,
    data: Record<string, unknown>[],
): void {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const escape = (v: unknown) =>
        `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = data.map((row) => headers.map((h) => escape(row[h])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
