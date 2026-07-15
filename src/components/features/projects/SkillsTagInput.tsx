"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/data-display/badge";
import { suggestedSkills } from "@/lib/constants/projects/project-form-data";

// ──────────────────────────────────────────────────────────────────
// SkillsTagInput
// Owns: the skills tag input section — animated badge list,
//       text input, and suggested skill badges.
// ──────────────────────────────────────────────────────────────────
export function SkillsTagInput({
    tags,
    inputValue,
    setInputValue,
    onAdd,
    onRemove,
    onKeyDown,
    error,
}: {
    tags: string[];
    inputValue: string;
    setInputValue: (v: string) => void;
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex flex-col gap-3">
                <div className={`flex flex-wrap gap-2 px-3 py-2 min-h-10 w-full rounded-md border text-sm focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2 dark:focus-within:ring-slate-800 transition-shadow ${error ? "border-red-500 bg-red-50/10" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80"}`}>
                    <AnimatePresence>
                        {tags.map((tag) => (
                            <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60 rounded flex items-center gap-1 font-medium select-none"
                                >
                                    {tag}
                                    <div
                                        className="cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/60 rounded-full p-0.5 transition-colors"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove(tag);
                                        }}
                                    >
                                        <X className="h-3 w-3 hover:text-purple-900 dark:hover:text-purple-100" />
                                    </div>
                                </Badge>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <input
                        id="skills"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={tags.length === 0 ? "Type skill and press Enter..." : ""}
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-sm min-w-[120px] text-slate-900 dark:text-white placeholder:text-muted-foreground"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill) => (
                        <Badge
                            key={skill}
                            variant="outline"
                            className={`cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 ${tags.includes(skill) ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => onAdd(skill)}
                        >
                            + {skill}
                        </Badge>
                    ))}
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}