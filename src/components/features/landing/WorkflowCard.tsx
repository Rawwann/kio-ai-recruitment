"use client";

import { Card, CardContent } from "@/components/ui/layout/card";
import React from "react";

interface WorkflowCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
}

export const WorkflowCard = ({ title, desc, icon }: WorkflowCardProps) => (
    <Card className="relative w-[312px] h-[260px] bg-white/10 backdrop-blur-md border border-white/60 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:translate-y-[-5px] group">
        <CardContent className="p-8 h-full flex flex-col items-start text-left">
            <div
                style={{
                    background: 'linear-gradient(149deg, rgba(230, 244, 255, 0.7) 4%, rgba(240, 214, 255, 0.7) 60%, rgba(199, 125, 255, 0.7) 100%)'
                }}
                className="
                    w-[42px] h-[42px] 
                    rounded-[14px] 
                    border-2 border-white/80   
                    flex items-center justify-center 
                    p-5
                    mb-6 
                    shadow-[0px_4px_10px_rgba(180,156,197,0.1)] 
                    transition-transform group-hover:scale-110
                "
            >
                <div className="text-purple-700">
                    {icon}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#1A0033] text-[18px] tracking-tight">{title}</h3>
                <p className="text-[#6B7280] text-[14px] leading-relaxed">{desc}</p>
            </div>
        </CardContent>
    </Card>
);