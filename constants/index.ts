export const REQUEST_STATUS = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    IN_REVIEW: "in_review",
    CLOSED: "closed",
} as const;

export type RequestStatus =
    (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
