export interface ComparisonRow {
    feature: string;
    traditional: string;
    kio: string;
}

export const COMPARISON_DATA: ComparisonRow[] = [
    { feature: "Assessment Basis", traditional: "Based on CVs and interviews only", kio: "Based on real project performance" },
    { feature: "Skill Assessment", traditional: "Theoretical and subjective", kio: "Practical and data-driven" },
    { feature: "Soft Skills Evaluation", traditional: "Difficult to measure", kio: "Measured through teamwork and collaboration" },
    { feature: "Technical Skills Validation", traditional: "Limited and indirect", kio: "Validated through real coding tasks and GitHub activity" },
    { feature: "Recruitment Speed", traditional: "Slow and time-consuming", kio: "Faster and more efficient" },
    { feature: "Data Visibility", traditional: "Fragmented and manual", kio: "Centralized dashboards and reports" },
    { feature: "Decision Making", traditional: "Subjective and delayed", kio: "Objective and data-driven" },
    { feature: "Role Fit Accuracy", traditional: "High risk of role mismatch", kio: "Improved role-fit accuracy" },
    { feature: "Cheating & Assessment Integrity", traditional: "Hard to detect cheating", kio: "Behavior-based anomaly detection" },
    { feature: "Overall Hiring Quality", traditional: "Inconsistent results", kio: "More reliable and fair hiring outcomes" },
];