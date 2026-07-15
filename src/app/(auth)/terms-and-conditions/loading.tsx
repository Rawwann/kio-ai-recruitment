const line = "h-3 w-full animate-pulse rounded bg-muted/50";

export default function Loading() {
    return (
        <div className="w-full max-w-3xl space-y-3">
            <div className={line} style={{ width: "38%" }} aria-hidden />
            <div className={line} aria-hidden />
            <div className={line} style={{ width: "90%" }} aria-hidden />
            <div className={line} style={{ width: "85%" }} aria-hidden />
            <div className={line} style={{ width: "72%" }} aria-hidden />
            <div className={line} style={{ width: "96%" }} aria-hidden />
            <div className={line} style={{ width: "68%" }} aria-hidden />
        </div>
    );
}
