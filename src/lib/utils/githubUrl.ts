/**
 * Parse and validate a public GitHub repository URL for the apply flow.
 * Accepts https://github.com/owner/repo, http (normalized to https), and owner/repo (prefix https).
 */
export function parseAndValidateGitHubRepoUrl(
    input: string,
): { ok: true; url: string } | { ok: false; error: string } {
    const raw = input.trim();
    if (!raw) {
        return { ok: false, error: "Enter your GitHub repository URL." };
    }
    const withProtocol =
        raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

    let u: URL;
    try {
        u = new URL(withProtocol);
    } catch {
        return { ok: false, error: "That doesn’t look like a valid URL." };
    }

    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "github.com") {
        return { ok: false, error: "URL must be a link on github.com (e.g. https://github.com/owner/repository)." };
    }

    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
        return {
            ok: false,
            error: "Use the full repository URL, e.g. https://github.com/owner/repository",
        };
    }

    u.protocol = "https:";
    u.hash = "";
    u.search = "";
    let path = u.pathname.replace(/\/+$/, "");
    if (path.toLowerCase().endsWith(".git")) {
        path = path.slice(0, -4);
        u.pathname = path || "/";
    }
    return { ok: true, url: u.toString() };
}
