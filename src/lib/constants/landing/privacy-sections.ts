import { LegalSection } from "@/types/legal";

// ──────────────────────────────────────────────────────────────────
// Privacy Policy — Section Data
// ──────────────────────────────────────────────────────────────────
export const PRIVACY_SECTIONS: LegalSection[] = [
    {
        id: "overview",
        title: "Overview",
        content: "Welcome to KIO. Our mission is to transform technical recruitment through project-based evaluation. Protecting your privacy is central to this mission. This Privacy Policy explains how we collect, use, and safeguard your personal data when you use our platform."
    },
    {
        id: "information-we-collect",
        title: "Information We Collect",
        content: "We collect data to provide a seamless recruitment experience. This includes:",
        list: [
            { title: "Identity Data", description: "Name, email, and password." },
            { title: "Professional Data", description: "LinkedIn/GitHub profiles, skills, and resumes." },
            { title: "Technical Data", description: "Code submissions, commit history, and AI evaluation results." }
        ]
    },
    {
        id: "how-we-use-data",
        title: "How We Use Data",
        content: "Your data helps us power the KIO ecosystem. We use it to:",
        list: [
            { description: "Providing AI-driven recruitment insights." },
            { description: "Detecting plagiarism and cheating during projects." },
            { description: "Facilitating communication between companies and candidates." }
        ]
    },
    {
        id: "data-sharing",
        title: "Data Sharing",
        content: "We do not sell your data. We share information only with: (1) Companies you explicitly apply to; (2) Trusted service providers like Google Gemini for AI analysis; and (3) Legal authorities if required by law to protect our users and rights."
    },
    {
        id: "security-measures",
        title: "Security Measures",
        content: "KIO is built with security at its core. We implement industry-standard encryption, secure API integrations, and continuous monitoring to protect your professional data from unauthorized access, loss, or misuse."
    },
    {
        id: "user-choices",
        title: "User Choices",
        content: "You are in control of your data. You can access, update, or delete your account information at any time through your dashboard settings. Candidates may also choose which external repositories or profiles to link to their KIO account."
    },
    {
        id: "policy-changes",
        title: "Policy Changes",
        content: "We may update this policy to reflect changes in our services or legal obligations. Significant updates will be notified via email or a prominent notice on our platform. Your continued use of KIO constitutes acceptance of the updated terms."
    },
    {
        id: "contact-us",
        title: "Contact Us",
        content: "If you have any questions or concerns, please reach out to our team:"
    }
];