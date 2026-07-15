import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { STEP_TITLES, STEP_DESCRIPTIONS } from "@/lib/constants/auth/step-content";

export function useResetPassword() {
    const router = useRouter();

    // States
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Validations
    const isStep1Valid = useMemo(() => email.trim().length > 0 && email.includes("@"), [email]);
    const isStep2Valid = useMemo(() => otp.every((digit) => digit.trim().length === 1), [otp]);

    // Computed Content
    const stepTitle = STEP_TITLES[step];
    const stepDescription = step === 2
        ? STEP_DESCRIPTIONS[2](email)
        : STEP_DESCRIPTIONS[step as 1 | 3];

    // API Handlers
    const handleSendCode = async () => {
        if (!isStep1Valid) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/forgot-password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                toast.success("Reset code sent to your email.");
                setStep(2);
            } else {
                toast.error("Email not found. Please try again.");
            }
        } catch (error) {
            toast.error("Connection error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!isStep2Valid) {
            toast.error("Please enter the 6-digit code.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join("") })
            });
            if (response.ok) {
                toast.success("Code verified.");
                setStep(3);
            } else {
                toast.error("Invalid or expired code.");
            }
        } catch (error) {
            toast.error("Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/reset-password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join(""), new_password: newPassword })
            });
            if (response.ok) {
                toast.success("Password reset successfully!");
                router.push("/login");
            } else {
                toast.error("Failed to reset password.");
            }
        } catch (error) {
            toast.error("Server error.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return {
        step, setStep, email, setEmail, otp, setOtp, otpRefs,
        newPassword, setNewPassword, confirmPassword, setConfirmPassword,
        showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
        isLoading, stepTitle, stepDescription,
        handleSendCode, handleVerifyCode, handleResetPassword, handleOtpChange, handleOtpKeyDown
    };
}