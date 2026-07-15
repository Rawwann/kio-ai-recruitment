const line = "h-3 w-full animate-pulse rounded bg-muted/50";

export default function Loading() {
    return (
        <div className="w-full max-w-3xl space-y-3">
            <div className={line} style={{ width: "42%" }} aria-hidden />
            <div className={line} aria-hidden />
            <div className={line} style={{ width: "92%" }} aria-hidden />
            <div className={line} style={{ width: "88%" }} aria-hidden />
            <div className={line} style={{ width: "76%" }} aria-hidden />
            <div className={line} style={{ width: "94%" }} aria-hidden />
            <div className={line} style={{ width: "70%" }} aria-hidden />
        </div>
    );
}
