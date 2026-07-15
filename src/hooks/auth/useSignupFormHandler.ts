import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, recruiterRegisterSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DJANGO_URL = process.env.NEXT_PUBLIC_DJANGO_URL ?? 'http://127.0.0.1:8000';

/** Strip spaces, brackets, dashes; keep optional leading + then digits (E.164-friendly). */
function cleanPhoneForApi(raw: unknown): string {
    const s = String(raw ?? '').trim();
    if (!s) return '';
    const leadingPlus = s.startsWith('+');
    const digits = s.replace(/\D/g, '');
    if (!digits) return '';
    return leadingPlus ? `+${digits}` : digits;
}

function buildCompanyRegisterPayload(data: Record<string, unknown>) {
    const email = String(data.email ?? '');
    // Django CompanyRegisterSerializer accepts companyName (preferred) or company_name; both normalize in validate().
    return {
        email,
        companyName: String(data.companyName ?? '').trim(),
        phone: cleanPhoneForApi(data.phone),
        password: String(data.password ?? ''),
    };
}

function buildCandidateRegisterPayload(data: Record<string, unknown>) {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: cleanPhoneForApi(data.phone),
        password: data.password,
        date_of_birth: data.dateOfBirth || null,
        gender: data.gender || null,
        terms: true as const,
        role: 'CANDIDATE' as const,
    };
}

async function parseDjangoErrorBody(res: Response): Promise<{ parsed: unknown; rawText: string }> {
    const rawText = await res.text();
    if (!rawText) return { parsed: null, rawText: '' };
    try {
        return { parsed: JSON.parse(rawText) as unknown, rawText };
    } catch {
        return { parsed: rawText, rawText };
    }
}

export function useSignupFormHandler(
    role: string | null,
    currentStep: number,
    nextStep: () => void,
    cvFile: File | null,
) {
    const router = useRouter();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const normalizedRole = role ?? 'candidate';
    const currentSchema =
        normalizedRole === 'candidate' ? candidateSchema : recruiterRegisterSchema;

    const methods = useForm({
        resolver: zodResolver(currentSchema as any),
        mode: 'onTouched',
        defaultValues: {
            firstName: '', lastName: '', companyName: '', email: '',
            phone: '', password: '', rePassword: '', dateOfBirth: '',
            gender: undefined, terms: false,
        },
    });

    const handleNext = async () => {
        if (currentStep === 1) {
            nextStep();
        } else if (currentStep === 2) {
            const fieldsToValidate =
                role === 'candidate'
                    ? ['firstName', 'lastName', 'email', 'phone', 'password', 'rePassword', 'dateOfBirth', 'gender', 'terms']
                    : ['companyName', 'email', 'phone', 'password', 'rePassword', 'terms'];

            const isStep2Valid = await methods.trigger(fieldsToValidate as any);
            if (isStep2Valid) {
                if (role === 'recruiter') {
                    methods.handleSubmit(onSubmit)();
                } else {
                    nextStep();
                }
            }
        }
    };

    const onSubmit = async (data: any) => {
        const isCandidate = normalizedRole === 'candidate';
        const endpoint = isCandidate ? '/api/users/register/' : '/api/users/register/company/';
        const payload = isCandidate ? buildCandidateRegisterPayload(data) : buildCompanyRegisterPayload(data);

        try {
            // ── Step A: Register the user ──────────────────────────────────────
            const regRes = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!regRes.ok) {
                const { parsed: errBody, rawText } = await parseDjangoErrorBody(regRes);
                console.error('[Signup] Django rejected registration — status:', regRes.status, 'endpoint:', endpoint);
                console.error('[Signup] Django response body (parsed):', errBody);
                console.error('[Signup] Django response body (raw text):', rawText || '(empty)');
                if (errBody !== null && typeof errBody === 'object') {
                    console.error('[Signup] Django field errors (JSON):', JSON.stringify(errBody, null, 2));
                }
                let detail = 'Registration failed. Please check your details.';
                if (errBody && typeof errBody === 'object' && !Array.isArray(errBody)) {
                    const o = errBody as Record<string, unknown>;
                    if (o.detail != null) detail = String(o.detail);
                    else {
                        const flat = Object.values(o)
                            .flat()
                            .map((v) => String(v))
                            .filter(Boolean);
                        if (flat.length) detail = flat.join(' ');
                    }
                } else if (typeof errBody === 'string' && errBody.trim()) {
                    detail = errBody.trim();
                }
                toast.error(detail);
                return;
            }

            const regJson = await regRes.json();
            const accessToken: string = regJson.token ?? regJson.access ?? '';

            // ── Step B (candidates only): Upload CV with the fresh access token ─
            if (isCandidate && cvFile && accessToken) {
                const formData = new FormData();
                formData.append('cv_file', cvFile);

                const cvRes = await fetch(`${DJANGO_URL}/api/users/upload-cv/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body: formData,
                });

                if (!cvRes.ok) {
                    await cvRes.json().catch(() => ({}));
                    // Non-fatal — user can upload later from their profile
                    toast.warning('Account created, but CV upload failed. You can upload it from your profile.');
                }
            }

            // ── Step C: Auto sign-in and redirect to dashboard ─────────────────
            toast.success('Account created! Logging you in…');

            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.ok) {
                const destination = isCandidate ? '/candidate/dashboard' : '/company/dashboard';
                router.push(destination);
            } else {
                // Session creation failed — send them to login so they can do it manually
                toast.info('Please log in with your new credentials.');
                router.push('/login');
            }
        } catch (err) {
            console.error('[Signup] Registration threw (network / parse / unexpected):', err);
            if (err instanceof Error) {
                console.error('[Signup] Error message:', err.message, 'stack:', err.stack);
            }
            toast.error('Cannot reach the server. Is Django running?');
        }
    };

    return {
        methods,
        isAnalyzing,
        setIsAnalyzing,
        handleNext,
        onSubmit: methods.handleSubmit(onSubmit),
        isSubmitting: methods.formState.isSubmitting,
    };
}
