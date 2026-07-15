export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export const FAQ_DATA: FaqItem[] = [
    {
        id: "item-1",
        question: "How secure is KIO?",
        answer: "KIO takes security seriously. We use industry-standard encryption to protect all data in transit and at rest. Our platform integrates with LinkedIn and GitHub using OAuth 2.0, which means we never handle or store your passwords directly. This provides an extra layer of security for both companies and candidates. We follow strict data protection practices to ensure all information remains confidential and secure."
    },
    {
        id: "item-2",
        question: "Can KIO integrate with existing tools?",
        answer: "Absolutely. KIO is designed to work seamlessly with the tools you already use. We offer direct integration with GitHub for repository analysis and project collaboration. Our LinkedIn integration allows for easy identity verification and profile import. Plus, our flexible API means you can connect KIO with other HR systems or platforms as needed."
    },
    {
        id: "item-3",
        question: "How quickly can I see results?",
        answer: "Fast. Once a candidate submits their project, our AI analyzes the code and generates a detailed evaluation report in just minutes—typically under five. Companies can immediately view scores, metrics, and personalized feedback in their dashboard as soon as the analysis is complete."
    },
    {
        id: "item-4",
        question: "Do you offer support for users?",
        answer: "Yes, we're here to help. All users have access to our support team via email and live chat. Companies on premium plans also receive priority assistance and personalized onboarding guidance to ensure a smooth and successful experience with KIO."
    },
    {
        id: "item-5",
        question: "Is KIO free to use?",
        answer: "KIO is a B2B SaaS platform built for companies. We offer a free trial so you can explore all the features and see how KIO can transform your technical recruitment process. After your trial, access requires a paid subscription plan tailored to your team's size and needs."
    }
];