"use client";

import React from 'react';
import { Card } from "@/components/ui/layout/card";
import { Step1RoleProps } from "@/types";
import { ROLE_OPTIONS } from "@/lib/constants/auth/role-options";

export default function Step1Role({ selectedRole, onRoleSelect }: Step1RoleProps) {

    const handleSelect = (role: "recruiter" | "candidate") => {
        onRoleSelect(role);
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-center">Select your role</h2>

            <div className="grid grid-cols-2 gap-4">
                {ROLE_OPTIONS.map((option) => (
                    <Card
                        key={option.value}
                        className={`p-6 cursor-pointer transition-all hover:shadow-lg ${selectedRole === option.value
                            ? "border-2 border-primary bg-primary/5"
                            : "border border-border"
                            }`}
                        onClick={() => handleSelect(option.value)}
                    >
                        <div className="flex flex-col items-center text-center space-y-2">
                            {option.icon}
                            <h3 className="text-lg font-semibold">{option.label}</h3>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}