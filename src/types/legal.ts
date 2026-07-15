// ──────────────────────────────────────────────────────────────────
// Used by both PrivacyPolicy and TermsAndConditions
// ──────────────────────────────────────────────────────────────────

export interface LegalSectionListItem {
    title?: string;
    description: string;
}

export interface LegalSection {
    id: string;
    title: string;
    content: string;
    list?: LegalSectionListItem[];
}