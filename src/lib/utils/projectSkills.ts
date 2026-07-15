/** Normalise required skills from API (array) or legacy comma-separated string. */
export function normalizeSkillList(
    primary?: string[] | string,
    fallback?: string[] | string,
): string[] {
    const take = (value: string[] | string | undefined): string[] => {
        if (value == null) return [];
        if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
        return value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    };
    const fromPrimary = take(primary);
    if (fromPrimary.length > 0) return fromPrimary;
    return take(fallback);
}
