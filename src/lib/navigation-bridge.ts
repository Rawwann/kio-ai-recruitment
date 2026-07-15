/**
 * Allows non-React modules (e.g. apiFetch) to trigger client-side navigations
 * after registering the router from a client component.
 */
type NavPush = (href: string) => void;

let pushRef: NavPush | null = null;

export function registerNavPush(push: NavPush) {
    pushRef = push;
}

export function unregisterNavPush(push: NavPush) {
    if (pushRef === push) pushRef = null;
}

/** Prefer SPA navigation; fall back to hard navigation if router not ready. */
export function navPush(href: string) {
    if (pushRef) pushRef(href);
    else if (typeof window !== "undefined") window.location.href = href;
}
