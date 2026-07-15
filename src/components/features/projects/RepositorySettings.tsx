"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Switch } from "@/components/ui/forms/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";

// ──────────────────────────────────────────────────────────────────
// Shared starter template options used by both Individual & Team
// ──────────────────────────────────────────────────────────────────
const STARTER_TEMPLATES = [
    {
        value: "https://github.com/vercel/next.js/tree/canary/examples/hello-world",
        label: "Next.js Starter"
    },
    {
        value: "https://github.com/react-boilerplate/react-boilerplate",
        label: "React App Component"
    },
    {
        value: "https://github.com/hagopj13/node-express-boilerplate",
        label: "Node.js Express"
    },
    {
        value: "https://github.com/eagerui/eagerui-django-nextjs-starter",
        label: "Django + Next.js"
    },
    {
        value: "https://github.com/vuejs-templates/webpack",
        label: "Vue.js Template"
    },
    {
        value: "https://github.com/wlucha/angular-starter",
        label: "Angular Starter"
    },

] as const;

// ──────────────────────────────────────────────────────────────────
// RepositorySettings
// Owns: the Repository Settings section with AnimatePresence tab
//       switching between individual and team.
//       Both tabs now use the same STARTER_TEMPLATES dropdown.
// ──────────────────────────────────────────────────────────────────
export function RepositorySettings({
    activeTab,
    starterTemplate,
    setStarterTemplate,
    baseRepo,
    setBaseRepo,
    passingScore,
    setPassingScore,
    errors,
    setErrors,
}: {
    activeTab: string;
    starterTemplate: string;
    setStarterTemplate: (v: string) => void;
    baseRepo: string;
    setBaseRepo: (v: string) => void;
    passingScore: string;
    setPassingScore: (v: string) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
    // Use the same handler for both tabs — individual writes to starterTemplate,
    // team writes to baseRepo.
    const isTeam = activeTab === "team";
    const currentValue = isTeam ? baseRepo : starterTemplate;
    const errorKey = isTeam ? "baseRepo" : "starterTemplate";
    const handleTemplateChange = (val: string) => {
        if (isTeam) {
            setBaseRepo(val);
            if (errors.baseRepo) setErrors((prev) => ({ ...prev, baseRepo: "" }));
        } else {
            setStarterTemplate(val);
            if (errors.starterTemplate) setErrors((prev) => ({ ...prev, starterTemplate: "" }));
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Repository Settings</h3>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`repo-${activeTab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row justify-between items-start gap-8"
                >
                    {/* Starter Template Dropdown — shared */}
                    <div className="flex items-end gap-4 w-full md:w-auto">
                        <div className="space-y-2 flex-1 md:w-64">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Select Starter Template
                            </Label>
                            <Select onValueChange={handleTemplateChange} value={currentValue}>
                                <SelectTrigger
                                    className={`bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 ${errors[errorKey] ? "border-red-500 bg-red-50/10" : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Select a starter template..." />
                                </SelectTrigger>
                                {/* @ts-ignore */}
                                <SelectContent>
                                    {STARTER_TEMPLATES.map((tmpl) => (
                                        // @ts-ignore
                                        <SelectItem key={tmpl.value} value={tmpl.value}>
                                            {tmpl.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors[errorKey] && (
                                <p className="text-red-500 text-xs mt-1">{errors[errorKey]}</p>
                            )}
                        </div>

                        {/* Passing Score */}
                        <div className="space-y-2 shrink-0">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Passing Score</Label>
                            <Input
                                type="number"
                                placeholder="70"
                                value={passingScore}
                                onChange={(e) => {
                                    setPassingScore(e.target.value);
                                    if (errors.passingScore) setErrors((prev) => ({ ...prev, passingScore: "" }));
                                }}
                                className={`bg-slate-50 dark:bg-slate-900/80 w-24 ${errors.passingScore ? "border-red-500 bg-red-50/10" : ""
                                    }`}
                            />
                            {errors.passingScore && (
                                <p className="text-red-500 text-xs mt-1">{errors.passingScore}</p>
                            )}
                        </div>
                    </div>

                    {/* Switches */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Switch id={`visibility-${activeTab}`} className="bg-slate-200 dark:bg-slate-700" />
                                <Label
                                    htmlFor={`visibility-${activeTab}`}
                                    className="text-sm text-slate-700 dark:bg-slate-900/80 font-medium cursor-pointer"
                                >
                                    Make Project Private
                                </Label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-center space-x-3 opacity-60">
                                <Switch
                                    id={`anti-cheat-${activeTab}`}
                                    disabled
                                    className="bg-slate-200 dark:bg-slate-800 data-[state=checked]:bg-indigo-600"
                                />
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <Label
                                            htmlFor={`anti-cheat-${activeTab}`}
                                            className="text-sm text-slate-500 font-medium flex items-center gap-1 cursor-not-allowed"
                                        >
                                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                                            Enable Anti-Cheat Detection
                                        </Label>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 tracking-wider">
                                            PRO
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Available on premium plans</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}