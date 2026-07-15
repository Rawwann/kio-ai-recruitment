"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/forms/label";
import { Slider } from "@/components/ui/forms/slider";

// ──────────────────────────────────────────────────────────────────
// AIGradingSliders
// Owns: the AI Grading Focus section with AnimatePresence tab
//       switching between individual (4 sliders) and team (4 sliders).
// ──────────────────────────────────────────────────────────────────
export function AIGradingSliders({
    activeTab,
    // Individual sliders
    codeQuality,
    setCodeQuality,
    performance,
    setPerformance,
    documentation,
    setDocumentation,
    bestPractices,
    setBestPractices,
    // Team sliders
    collaboration,
    setCollaboration,
    prQuality,
    setPrQuality,
    codeReview,
    setCodeReview,
    workload,
    setWorkload,
}: {
    activeTab: string;
    codeQuality: number[];
    setCodeQuality: (v: number[]) => void;
    performance: number[];
    setPerformance: (v: number[]) => void;
    documentation: number[];
    setDocumentation: (v: number[]) => void;
    bestPractices: number[];
    setBestPractices: (v: number[]) => void;
    collaboration: number[];
    setCollaboration: (v: number[]) => void;
    prQuality: number[];
    setPrQuality: (v: number[]) => void;
    codeReview: number[];
    setCodeReview: (v: number[]) => void;
    workload: number[];
    setWorkload: (v: number[]) => void;
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">AI Grading Focus</h3>

            <AnimatePresence mode="wait">
                {activeTab === "individual" ? (
                    <motion.div
                        key="individual-sliders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Code Quality</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{codeQuality[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={codeQuality} onValueChange={setCodeQuality} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Performance</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{performance[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={performance} onValueChange={setPerformance} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Documentation & Commits</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{documentation[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={documentation} onValueChange={setDocumentation} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Best Practices</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{bestPractices[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={bestPractices} onValueChange={setBestPractices} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="team-sliders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Team Collaboration & Communication</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{collaboration[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={collaboration} onValueChange={setCollaboration} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Pull Request (PR) Quality</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{prQuality[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={prQuality} onValueChange={setPrQuality} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Code Review Participation</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{codeReview[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={codeReview} onValueChange={setCodeReview} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Workload Distribution Balance</Label>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{workload[0]}%</span>
                            </div>
                            <Slider defaultValue={[0]} value={workload} onValueChange={setWorkload} max={100} step={1} className="[&_[role=slider]]:bg-purple-900 [&_.bg-primary]:bg-purple-900" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}