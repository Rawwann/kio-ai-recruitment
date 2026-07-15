"use client";

import { motion } from "framer-motion";
import { TagSectionPrimary } from "@/components/features/landing/TagSectionPrimary";
import { WorkflowCard } from "./WorkflowCard";
import { CANDIDATE_STEPS, RECRUITER_STEPS } from "@/lib/constants/landing/workflow-steps";
import { FADE_UP_VARIANTS } from "@/lib/animations";

export default function HowItWorks() {
    return (
        <section className="w-full py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <TagSectionPrimary label="STEP-BY-STEP" />
                    <h2 className="text-4xl font-bold text-purple-950 mt-6 md:text-5xl">How KIO Works</h2>
                </div>

                {/* Candidate */}
                <div className="mb-20">
                    <h3 className="text-[20px] font-bold text-purple-950 mb-10">Candidate</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {CANDIDATE_STEPS.map((step, i) => (
                            <motion.div key={i} variants={FADE_UP_VARIANTS}>
                                <WorkflowCard {...step} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recruiter */}
                <div>
                    <h3 className="text-[20px] font-bold text-purple-950 mb-10">Recruiter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {RECRUITER_STEPS.map((step, i) => (
                            <motion.div key={i} variants={FADE_UP_VARIANTS}>
                                <WorkflowCard {...step} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
