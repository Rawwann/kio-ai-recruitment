'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInYears } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
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
import { Calendar } from '@/components/ui/overlays/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlays/popover';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/types/candidate';

const personalInfoSchema = z.object({
    full_name: z.string().min(1, 'This field is required'),
    phone_number: z.string().min(1, 'This field is required'),
    date_of_birth: z.string().optional().or(z.literal('')),
    gender: z.enum(['male', 'female', 'other']).optional(),
    address: z.string().optional().or(z.literal('')),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
    profile: UserProfile;
    onSubmit: (data: PersonalInfoFormData) => Promise<void>;
    isSubmitting: boolean;
}

export function PersonalInfoForm({ profile, onSubmit, isSubmitting }: PersonalInfoFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            full_name: profile.full_name,
            phone_number: profile.phone_number,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            address: profile.address,
        },
    });

    const dateOfBirth = watch('date_of_birth');
    const age = dateOfBirth ? differenceInYears(new Date(), new Date(dateOfBirth)) : null;
    const selectedDate = dateOfBirth ? new Date(dateOfBirth) : undefined;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
                <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                <Input id="full_name" {...register('full_name')} placeholder="Enter your full name" />
                {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled className="bg-muted cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Email cannot be changed as it's your login credential</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                    id="phone_number"
                    type="tel"
                    {...register('phone_number')}
                    placeholder="+1 (555) 123-4567"
                />
                {errors.phone_number && <p className="text-sm text-red-600">{errors.phone_number.message}</p>}
            </div>

            {/* Date of Birth & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn('w-full justify-start text-left font-normal', !dateOfBirth && 'text-muted-foreground')}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateOfBirth ? format(new Date(dateOfBirth), 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    if (date) setValue('date_of_birth', format(date, 'yyyy-MM-dd'));
                                }}
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.date_of_birth && <p className="text-sm text-red-600">{errors.date_of_birth.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Age</Label>
                    <Input value={age ? `${age} years old` : 'N/A'} disabled className="bg-muted cursor-not-allowed" />
                </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                    value={watch('gender')}
                    onValueChange={(value: 'male' | 'female' | 'other') => setValue('gender', value)}
                >
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    {...register('address')}
                    placeholder="Enter your full address"
                    className="resize-none min-h-[104px] max-h-[104px]"
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full kio-btn-ai-primary">
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
