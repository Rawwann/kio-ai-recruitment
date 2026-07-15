"use client";

import React, { useCallback } from 'react';
import * as RHF from "react-hook-form";
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useSignupFormHandler } from '@/hooks/auth/useSignupFormHandler';
import Step1Role from './signup/Step1Role';
import Step2Details from './signup/Step2Details';
import Step3CV from './signup/Step3CV';
import { Button } from '@/components/ui/forms/button';
import SignupStepper from '@/components/features/auth/signup/SignupStepper';
import CVLoadingScreen from './CVLoadingScreen';
import { Loader2, FileText, CheckCircle2, X } from 'lucide-react';
import { FieldSeparator, FieldGroup } from "@/components/ui/forms/field";
import { cn } from "@/lib/utils";
import { FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/layout/card";

const DJANGO_URL = process.env.NEXT_PUBLIC_DJANGO_URL ?? "http://127.0.0.1:8000";

export default function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const { FormProvider, useWatch } = RHF as any;
    const { currentStep, role, cvFile, cvAnalyzed, nextStep, prevStep, updateForm, totalSteps } = useSignupForm();

    const { methods, isAnalyzing, setIsAnalyzing, handleNext, onSubmit, isSubmitting } =
        useSignupFormHandler(role, currentStep, nextStep, cvFile);

    const termsAccepted = useWatch({ control: methods.control, name: 'terms', defaultValue: false }) as boolean;
    const isFinalSubmitStep =
        currentStep === totalSteps || (currentStep === 2 && role === 'recruiter');

    // Called by CVLoadingScreen when the AI parsing animation finishes.
    // useCallback keeps the reference stable so useCVLoadingSteps never restarts.
    const handleCVAnalysisComplete = useCallback(() => {
        setIsAnalyzing(false);
        updateForm({ cvAnalyzed: true });
    }, [setIsAnalyzing, updateForm]);

    // Called by Step3CV/useCVUpload with the selected File.
    // This is the ONLY place cvFile is written into the shared SignupForm state.
    const handleFileSelected = useCallback((file: File) => {
        updateForm({ cvFile: file });
        setIsAnalyzing(true);
    }, [updateForm, setIsAnalyzing]);

    const renderStep3Content = () => {
        if (isAnalyzing) {
            return (
                <CVLoadingScreen onComplete={handleCVAnalysisComplete} />
            );
        }

        if (cvAnalyzed && cvFile) {
            return (
                <div className="w-full space-y-6 text-center">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
                    <h2 className="text-xl font-semibold">CV Analysed Successfully!</h2>
                    <div className="flex items-center gap-3 bg-green-50/60 border border-green-200 rounded-lg p-4 text-left">
                        <FileText className="h-8 w-8 text-green-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium truncate text-green-900">{cvFile.name}</p>
                            <p className="text-xs text-green-700 mt-0.5">
                                {(cvFile.size / 1024 / 1024).toFixed(2)} MB — ready to upload
                            </p>
                        </div>
                        {/* Allow the user to swap to a different file */}
                        <button
                            type="button"
                            onClick={() => updateForm({ cvFile: null, cvAnalyzed: false })}
                            className="ml-auto shrink-0 rounded-full p-1 text-green-700 hover:bg-green-200/60 hover:text-green-900 transition-colors"
                            title="Remove and choose a different file"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Click <span className="font-medium text-purple-800">Create Account</span> below to finish registration and upload your CV.
                    </p>
                </div>
            );
        }

        // Default: show the drop zone
        return (
            <Step3CV onFileUploaded={handleFileSelected} />
        );
    };

    return (
        <FormProvider {...methods}>
            <div className={cn("flex flex-col gap-6 w-full max-w-6xl mx-auto pt-28 pb-14", className)} {...props}>
                <Card className="border border-white/40 shadow-2xl overflow-hidden p-0 bg-transparent rounded-3xl">
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0 min-h-[600px]">

                        <form
                            className="p-8 md:p-12 flex flex-col justify-center bg-white/20 backdrop-blur-md border-r border-white/40"
                            onSubmit={onSubmit}
                        >
                            <div className="mb-8">
                                <SignupStepper currentStep={currentStep} role={role} />
                            </div>

                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center mb-10">
                                    <h1 className="text-3xl font-bold">Create your account</h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Let&apos;s get to know you better
                                    </p>
                                </div>

                                <div className="flex-1 w-full mx-auto">
                                    {currentStep === 1 && (
                                        <Step1Role
                                            selectedRole={role}
                                            onRoleSelect={(r) => updateForm({ role: r })}
                                        />
                                    )}
                                    {/* Keep step 2 mounted on step 3 so `terms` (Controller) is not torn down and reset. */}
                                    {currentStep >= 2 && role && (
                                        <div className={cn(currentStep !== 2 && 'hidden')} aria-hidden={currentStep !== 2}>
                                            <Step2Details role={role} />
                                        </div>
                                    )}
                                    {currentStep === 3 && role === 'candidate' && renderStep3Content()}
                                </div>

                                {currentStep === 2 && (
                                    <div className="mt-8 w-full mx-auto">
                                        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#FBF5FF] mb-6">
                                            Or continue with
                                        </FieldSeparator>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Button
                                                variant="outline" type="button"
                                                className="w-full gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                                                onClick={() => window.location.href = `${DJANGO_URL}/api/users/linkedin/login/?role=${role ?? 'candidate'}`}
                                                title="Continue with LinkedIn"
                                            ><FaLinkedin className="size-4" /></Button>
                                            <Button
                                                variant="outline" type="button"
                                                className="w-full gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                                                onClick={() => window.location.href = `${DJANGO_URL}/api/users/github/login/?role=${role ?? 'candidate'}`}
                                                title="Continue with GitHub"
                                            ><FaGithub className="size-4" /></Button>
                                            <Button
                                                variant="outline" type="button"
                                                className="w-full gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                                                onClick={() => window.location.href = `${DJANGO_URL}/api/users/google/login/?role=${role ?? 'candidate'}`}
                                                title="Continue with Google"
                                            ><FaGoogle className="size-4" /></Button>
                                        </div>
                                    </div>
                                )}
                            </FieldGroup>
                        </form>

                        <div
                            className="relative hidden md:flex flex-col items-center justify-center p-8 md:p-12 bg-purple-50/50"
                            style={{ backgroundImage: 'url(/bg-lines.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <img src="/logo.svg" alt="KIO Logo" className="w-20 h-auto mb-6 drop-shadow-md z-10" />
                            <h2 className="text-4xl leading-tight font-bold text-center bg-[linear-gradient(115deg,#6b21a8,#7c3aed,#d97706)] bg-clip-text text-transparent drop-shadow-sm z-10">
                                Empowering Talents<br />with AI insights
                            </h2>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between w-full mt-4">
                    {currentStep > 1 ? (
                        <Button
                            type="button" variant="outline"
                            onClick={prevStep} disabled={isSubmitting}
                            className="w-32 bg-white/50 backdrop-blur-md hover:bg-white/80 border-white/20 transition-colors shadow-sm"
                        >
                            Back
                        </Button>
                    ) : <div />}

                    <div className="flex items-center gap-4">
                        {/* Skip is only shown at step 3 when the drop zone is visible (not yet analysed) */}
                        {currentStep === 3 && role === 'candidate' && !cvAnalyzed && !isAnalyzing && (
                            <Button
                                type="button" variant="ghost"
                                className="text-slate-700 hover:text-slate-900 hover:bg-white/20 transition-colors"
                                onClick={onSubmit}
                            >
                                Skip for now
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={
                                currentStep === totalSteps || (currentStep === 2 && role === 'recruiter')
                                    ? onSubmit
                                    : handleNext
                            }
                            // Never disable the button during the AI analysis spinner — only
                            // while the actual registration API calls are in-flight (isSubmitting).
                            disabled={
                                isSubmitting ||
                                (currentStep === 1 && !role) ||
                                (currentStep === 3 && isAnalyzing) ||
                                (isFinalSubmitStep && !termsAccepted)
                            }
                            className="w-48 bg-purple-950 hover:bg-purple-900 text-white transition-colors shadow-lg kio-btn-ai-primary"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentStep === totalSteps || (currentStep === 2 && role === 'recruiter')
                                ? 'Create Account'
                                : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}
