export const ROLES = {
    CANDIDATE: "CANDIDATE",
    RECRUITER: "RECRUITER", // Or "COMPANY"
} as const;

export type RoleType = keyof typeof ROLES;
