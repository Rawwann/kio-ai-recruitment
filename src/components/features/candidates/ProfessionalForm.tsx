'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/forms/button';
import { Input } from '@/components/ui/forms/input';
import { Label } from '@/components/ui/forms/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/forms/select';
import { Textarea } from '@/components/ui/forms/textarea';
import { Badge } from '@/components/ui/data-display/badge';
import type { UserProfile } from '@/types/candidate';

// BUG-4.13: Standard tech roles for the Role dropdown
const ROLE_OPTIONS = [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'ML Engineer',
    'UI/UX Designer',
    'QA Engineer',
    'Software Architect',
    'Product Manager',
    'Other',
] as const;

const professionalSchema = z.object({
    education: z.string().min(1, 'This field is required'),
    years_of_experience: z.number().min(0, 'Experience cannot be negative'),
    interests: z.string().optional().or(z.literal('')),
    role: z.string().min(1, 'This field is required'),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

interface ProfessionalFormProps {
    profile: UserProfile;
    onSubmit: (data: ProfessionalFormData & { skills: string[]; role: string }) => Promise<void>;
    isSubmitting: boolean;
}

/**
 * BUG-4.13 FIX: The CV parser returns free-text roles like "Front-End Developer"
 * or "React Developer" which don't exactly match ROLE_OPTIONS. The Select component
 * silently ignores non-matching values. This normalizer maps parsed roles to the
 * closest ROLE_OPTIONS entry.
 */
function matchRoleToOption(parsed: string): string {
    if (!parsed) return '';
    const lower = parsed.toLowerCase().trim();

    // Direct match first
    const direct = ROLE_OPTIONS.find((r) => r.toLowerCase() === lower);
    if (direct) return direct;

    // Keyword-based fuzzy matching
    const keywordMap: Record<string, string> = {
        'frontend': 'Frontend Developer',
        'front-end': 'Frontend Developer',
        'front end': 'Frontend Developer',
        'react': 'Frontend Developer',
        'angular': 'Frontend Developer',
        'vue': 'Frontend Developer',
        'backend': 'Backend Developer',
        'back-end': 'Backend Developer',
        'back end': 'Backend Developer',
        'node': 'Backend Developer',
        'django': 'Backend Developer',
        'flask': 'Backend Developer',
        'spring': 'Backend Developer',
        'express': 'Backend Developer',
        'full-stack': 'Full-Stack Developer',
        'full stack': 'Full-Stack Developer',
        'fullstack': 'Full-Stack Developer',
        'mobile': 'Mobile Developer',
        'ios': 'Mobile Developer',
        'android': 'Mobile Developer',
        'flutter': 'Mobile Developer',
        'react native': 'Mobile Developer',
        'devops': 'DevOps Engineer',
        'sre': 'DevOps Engineer',
        'cloud': 'DevOps Engineer',
        'data scientist': 'Data Scientist',
        'data science': 'Data Scientist',
        'data analyst': 'Data Scientist',
        'machine learning': 'ML Engineer',
        'ml ': 'ML Engineer',
        'ai ': 'ML Engineer',
        'deep learning': 'ML Engineer',
        'ui/ux': 'UI/UX Designer',
        'ux': 'UI/UX Designer',
        'ui ': 'UI/UX Designer',
        'designer': 'UI/UX Designer',
        'qa': 'QA Engineer',
        'test': 'QA Engineer',
        'quality': 'QA Engineer',
        'architect': 'Software Architect',
        'product manager': 'Product Manager',
        'product owner': 'Product Manager',
    };

    for (const [keyword, option] of Object.entries(keywordMap)) {
        if (lower.includes(keyword)) return option;
    }

    // If nothing matches, use "Other" so the Select still shows a value
    return 'Other';
}

export function ProfessionalForm({ profile, onSubmit, isSubmitting }: ProfessionalFormProps) {
    const [skills, setSkills] = useState<string[]>(profile.skills);
    const [skillInput, setSkillInput] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(professionalSchema),
        defaultValues: {
            education: profile.education,
            years_of_experience: profile.years_of_experience,
            interests: profile.interests,
            role: matchRoleToOption(profile.role ?? ''),
        },
    });

    // BUG-4.13: Ensure form role updates when CV upload updates the profile role
    useEffect(() => {
        if (profile.role) {
            const matched = matchRoleToOption(profile.role);
            if (matched) {
                setValue('role', matched, { shouldValidate: true });
            }
        }
    }, [profile.role, setValue]);

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    const onFormSubmit = async (data: ProfessionalFormData) => {
        await onSubmit({ ...data, skills });
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* AI Disclaimer Alert */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50/50 border border-purple-100 mb-6">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-purple-900">AI-Powered Profile</p>
                    <p className="text-xs text-purple-700 leading-relaxed">
                        Our AI engine has automatically populated your professional profile from your CV.
                        You can review and refine any field below before saving.
                    </p>
                </div>
            </div>
            {/* Education */}
            <div className="space-y-2">
                <Label htmlFor="education">Education <span className="text-red-500">*</span></Label>
                <Input
                    id="education"
                    {...register('education')}
                    placeholder="e.g., BSc Computer Science - Stanford University"
                />
                {errors.education && <p className="text-sm text-red-600">{errors.education.message}</p>}
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience <span className="text-red-500">*</span></Label>
                <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    {...register('years_of_experience', { valueAsNumber: true })}
                    placeholder="5"
                />
                {errors.years_of_experience && (
                    <p className="text-sm text-red-600">{errors.years_of_experience.message}</p>
                )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
                <Label htmlFor="skills">Skills <span className="text-red-500">*</span></Label>
                <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter"
                />
                <p className="text-xs text-muted-foreground">Press Enter to add each skill</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="pl-3 pr-1">
                            {skill}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 ml-1 hover:bg-transparent"
                                onClick={() => handleRemoveSkill(skill)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
                {skills.length === 0 && (
                    <p className="text-sm text-yellow-600">Please add at least one skill</p>
                )}
            </div>

            {/* Interests */}
            <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Textarea
                    id="interests"
                    {...register('interests')}
                    placeholder="e.g., Web Development, AI/ML, UI/UX Design"
                    className="resize-none min-h-[104px] max-h-[104px]"
                    rows={3}
                />
                {errors.interests && <p className="text-sm text-red-600">{errors.interests.message}</p>}
            </div>

            {/* BUG-4.13: Role — parsed from CV or manually selected */}
            <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                <Select
                    value={watch('role')}
                    onValueChange={(value: string) => setValue('role', value, { shouldValidate: true })}
                >
                    <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                                {r}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
                <p className="text-xs text-muted-foreground">
                    This is auto-filled when you upload a CV. You can also set it manually.
                </p>
            </div>



            <Button
                type="submit"
                disabled={isSubmitting || skills.length === 0}
                className="w-full kio-btn-ai-primary"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </Button>
        </form>
    );
}
