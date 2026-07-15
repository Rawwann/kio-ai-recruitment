import { CompanyProfilePage } from "@/components/features/company/CompanyProfilePage";

export const metadata = {
    title: "Company Profile | KIO",
    description: "Manage your company profile, team members, billing, and notification settings.",
};

export default function CompanyProfileRoute() {
    return <CompanyProfilePage />;
}
