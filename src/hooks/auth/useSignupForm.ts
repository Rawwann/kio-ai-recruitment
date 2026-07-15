import { useState, useCallback } from 'react';

export function useSignupForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [role, setRole] = useState<'recruiter' | 'candidate' | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    // True once CVLoadingScreen finishes — prevents re-mounting the drop zone
    const [cvAnalyzed, setCvAnalyzed] = useState(false);

    const totalSteps = role === 'candidate' ? 3 : 2;

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateForm = useCallback((newData: {
        role?: 'recruiter' | 'candidate';
        cvFile?: File | null;
        cvAnalyzed?: boolean;
    }) => {
        if (newData.role) setRole(newData.role);
        if ('cvFile' in newData) setCvFile(newData.cvFile ?? null);
        if ('cvAnalyzed' in newData) setCvAnalyzed(newData.cvAnalyzed ?? false);
    }, []);

    return {
        currentStep,
        role,
        cvFile,
        cvAnalyzed,
        nextStep,
        prevStep,
        updateForm,
        totalSteps,
    };
}
