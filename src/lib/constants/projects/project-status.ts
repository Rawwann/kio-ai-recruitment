
export const PROJECT_STATUS = {
    OPEN: "OPEN",
    IN_PROGRESS: "IN_PROGRESS",
    CLOSED: "CLOSED",
    DRAFT: "DRAFT",
} as const;

export type ProjectStatusType = keyof typeof PROJECT_STATUS;

export const SUBMISSION_STATUS = {
    PENDING: "PENDING",
    UNDER_REVIEW: "UNDER_REVIEW",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
} as const;

export type SubmissionStatusType = keyof typeof SUBMISSION_STATUS;
