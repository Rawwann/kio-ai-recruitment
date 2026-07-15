"use client";

import React, { createContext, useContext, useState } from "react";
import { CompanyProfile } from "@/types";
import { createEmptyCompanyProfile } from "@/lib/constants/company-empty-profile";

export interface CompanyContextType {
    companyData: CompanyProfile;
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyProfile>>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
    const [companyData, setCompanyData] = useState<CompanyProfile>(createEmptyCompanyProfile);

    return (
        <CompanyContext.Provider value={{ companyData, setCompanyData }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = (): CompanyContextType => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error("useCompany must be used within a CompanyProvider");
    }
    return context;
};
