"use client";

import { Search, CalendarIcon, Info, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Textarea } from "@/components/ui/forms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlays/popover";
import { Calendar } from "@/components/ui/overlays/calendar";
import { Button } from "@/components/ui/forms/button";
import { AnimatedTabs } from "@/components/ui/layout/tabs";
import ShimmerButton from "@/components/vendors/magicui/shimmer-button";

// Hook
import { useProjectForm } from "@/hooks/projects/useProjectForm";

// Sub-components
import { SkillsTagInput } from "@/components/features/projects/SkillsTagInput";
import { AIGradingSliders } from "@/components/features/projects/AIGradingSliders";
import { RepositorySettings } from "@/components/features/projects/RepositorySettings";
import { ProjectSuccessDialog } from "@/components/features/projects/ProjectSuccessDialog";

// Constants

// ──────────────────────────────────────────────────────────────────
// ProjectForm — layout shell only
// All logic lives in useProjectForm.
// ──────────────────────────────────────────────────────────────────
export default function ProjectForm({ projectId }: { projectId?: string }) {
    const router = useRouter();
    const {
        isEditMode,
        activeTab,
        setActiveTab,
        title,
        setTitle,
        date,
        setDate,
        isDialogOpen,
        setIsDialogOpen,
        isCopied,
        starterTemplate,
        setStarterTemplate,
        baseRepo,
        setBaseRepo,
        passingScore,
        setPassingScore,
        description,
        setDescription,
        difficulty,
        setDifficulty,
        errors,
        setErrors,
        codeQuality,
        setCodeQuality,
        performance,
        setPerformance,
        documentation,
        setDocumentation,
        bestPractices,
        setBestPractices,
        collaboration,
        setCollaboration,
        prQuality,
        setPrQuality,
        codeReview,
        setCodeReview,
        workload,
        setWorkload,
        teamRoles,
        addRole,
        removeRole,
        updateRole,
        tags,
        inputValue,
        setInputValue,
        handleAddTag,
        handleRemoveTag,
        handleKeyDown,
        handleCopy,
        handleSubmit,
        shareUrl,
    } = useProjectForm(projectId);

    return (
        <div className="w-full bg-transparent relative min-h-screen overflow-hidden">
            <div className="relative z-10 w-full max-w-6xl mx-auto p-6 space-y-8">

                {/* Header Section */}
                <header className="flex w-full flex-col items-start gap-4 pb-2 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {isEditMode ? "Edit Project" : "Create Project"}
                    </h1>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="pl-10 h-11 bg-white dark:bg-slate-900/50 rounded-xl border-slate-200 dark:border-slate-800 shadow-sm"
                        />
                    </div>
                </header>

                {/* Project Type Toggle (Animated Tabs) */}
                <AnimatedTabs
                    tabs={[
                        { id: "individual", label: "Individual Project" },
                        { id: "team", label: "Team Project" }
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    className="mb-8"
                />

                {/* Main Form Container */}
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-10">

                    {/* General Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Project Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                                }}
                                placeholder="e.g., E-commerce React Challenge"
                                className={`bg-slate-50 dark:bg-slate-900/80 ${errors.title ? "border-red-500" : ""}`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Skills Tag Input */}
                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Required Skills (Tags)</Label>
                            <SkillsTagInput
                                tags={tags}
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                onAdd={handleAddTag}
                                onRemove={handleRemoveTag}
                                onKeyDown={handleKeyDown}
                                error={errors.skills}
                            />
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2 flex flex-col pt-1">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Deadline <span className="font-normal text-slate-400">(Optional)</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-full justify-start text-left font-normal border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 ${!date ? "text-muted-foreground" : ""} bg-slate-50 dark:bg-slate-900/80`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>No deadline (open project)</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    {/* @ts-ignore */}
                                    <Calendar
                                        className="p-3"
                                        mode="single"
                                        selected={date}
                                        //@ts-ignore
                                        onSelect={(newDate) => {
                                            setDate(newDate);
                                            if (errors.deadline) setErrors(prev => ({ ...prev, deadline: "" }));
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Difficulty Level */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulty Level</Label>
                            <Select
                                onValueChange={(val) => {
                                    setDifficulty(val);
                                    if (errors.difficulty) setErrors(prev => ({ ...prev, difficulty: "" }));
                                }}
                                value={difficulty}
                            >
                                <SelectTrigger className={`bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 ${errors.difficulty ? "border-red-500 bg-red-50/10" : ""}`}>
                                    <SelectValue placeholder="Junior / Middle / Senior" className="text-slate-700" />
                                </SelectTrigger>
                                {/* @ts-ignore */}
                                <SelectContent className="bg-white dark:bg-slate-900">
                                    {/* @ts-ignore */}
                                    <SelectItem className="text-slate-700 dark:text-slate-300" value="junior">Junior</SelectItem>
                                    {/* @ts-ignore */}
                                    <SelectItem className="text-slate-700 dark:text-slate-300" value="middle">Middle</SelectItem>
                                    {/* @ts-ignore */}
                                    <SelectItem className="text-slate-700 dark:text-slate-300" value="senior">Senior</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty}</p>}
                        </div>

                        {/* Dynamic Team Structure */}
                        <AnimatePresence mode="popLayout">
                            {activeTab === "team" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4 md:col-span-2 overflow-hidden"
                                >
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Team Roles Setup</Label>
                                    <div className="space-y-3">
                                        {teamRoles.map((roleObj, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <Select
                                                        value={roleObj.role}
                                                        onValueChange={(val) => updateRole(index, 'role', val)}
                                                    >
                                                        <SelectTrigger className={`bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 ${errors[`role_${index}`] ? "border-red-500 bg-red-50/10" : ""}`}>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        {/* @ts-ignore */}
                                                        <SelectContent>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="frontend">Frontend Developer</SelectItem>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="backend">Backend Developer</SelectItem>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="uiux">UI/UX Designer</SelectItem>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="devops">DevOps Engineer</SelectItem>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                                                            {/* @ts-ignore */}
                                                            <SelectItem value="mobile">Mobile Developer</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-24">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={roleObj.count}
                                                        onChange={(e) => updateRole(index, 'count', parseInt(e.target.value) || 1)}
                                                        className="bg-slate-50 dark:bg-slate-900/80"
                                                    />
                                                </div>
                                                {/* @ts-ignore */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeRole(index)}
                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                                                    disabled={teamRoles.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {errors.teamRoles && <p className="text-red-500 text-xs mt-1">{errors.teamRoles}</p>}
                                    </div>
                                    {/* @ts-ignore */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addRole}
                                        className="mt-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-transparent"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Role
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Detailed Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detailed Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                        }}
                        placeholder="In this simulation, candidates are required to build a responsive shopping cart using React hooks..."
                        className={`min-h-[120px] bg-slate-50 dark:bg-slate-900/80 resize-none ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* AI Grading Sliders */}
                <AIGradingSliders
                    activeTab={activeTab}
                    codeQuality={codeQuality}
                    setCodeQuality={setCodeQuality}
                    performance={performance}
                    setPerformance={setPerformance}
                    documentation={documentation}
                    setDocumentation={setDocumentation}
                    bestPractices={bestPractices}
                    setBestPractices={setBestPractices}
                    collaboration={collaboration}
                    setCollaboration={setCollaboration}
                    prQuality={prQuality}
                    setPrQuality={setPrQuality}
                    codeReview={codeReview}
                    setCodeReview={setCodeReview}
                    workload={workload}
                    setWorkload={setWorkload}
                />

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Repository Settings */}
                <RepositorySettings
                    activeTab={activeTab}
                    starterTemplate={starterTemplate}
                    setStarterTemplate={setStarterTemplate}
                    baseRepo={baseRepo}
                    setBaseRepo={setBaseRepo}
                    passingScore={passingScore}
                    setPassingScore={setPassingScore}
                    errors={errors}
                    setErrors={setErrors}
                />

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 pb-12 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => isEditMode ? router.back() : handleSubmit("Draft")}
                        className="w-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800 sm:w-auto"
                    >
                        {isEditMode ? "Cancel" : "Save Draft"}
                    </Button>
                    <div className="w-full sm:w-auto" onClick={() => handleSubmit("Active")}>
                        <ShimmerButton className="w-full shadow-2xl sm:w-auto" borderRadius="0.75rem" background="linear-gradient(115deg, #6b21a8, #7c3aed, #d97706)">
                            <span className="whitespace-pre-wrap text-center text-sm font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-base">
                                {isEditMode ? "Update Project" : "Publish Project"}
                            </span>
                        </ShimmerButton>
                    </div>
                </div>
            </div>

            {/* Success Dialog */}
            <ProjectSuccessDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                shareUrl={shareUrl}
                isCopied={isCopied}
                handleCopy={handleCopy}
            />
        </div>
    );
}
