"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { useCompany } from "@/lib/contexts/CompanyContext";

export function CompanyAvatar() {
    const { companyData } = useCompany();
    const [imgError, setImgError] = useState(false);
    const hasLogo = !!companyData.logoUrl && companyData.logoUrl.trim() !== "";

    if (hasLogo && !imgError) {
        return (
            <div className="h-7 w-7 shrink-0 rounded-md bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                    src={companyData.logoUrl}
                    className="w-full h-full object-contain p-0.5"
                    alt="Company Logo"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return (
        <div className="h-7 w-7 shrink-0 rounded-md bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-purple-700 dark:text-purple-300" />
        </div>
    );
}