export const STEP_TITLES = {
    1: "Forgot Password?",
    2: "Check Your Email",
    3: "Create New Password",
} as const;

export const STEP_DESCRIPTIONS = {
    1: "No worries, we'll send you a reset code.",
    2: (email: string) => `Enter the 6-digit code sent to ${email || "your email"}.`,
    3: "Your new password must be different from previous passwords.",
} as const;