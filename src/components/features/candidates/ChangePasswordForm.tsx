'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/forms/button';
import { Input } from '@/components/ui/forms/input';
import { Label } from '@/components/ui/forms/label';
import { Card, CardContent } from '@/components/ui/layout/card';

const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Current password is required'),
        new_password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirm_password: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

type ChangePasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
    onSubmit: (data: ChangePasswordFormData) => Promise<void>;
    isSubmitting: boolean;
}

export function ChangePasswordForm({ onSubmit, isSubmitting }: ChangePasswordFormProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: { current_password: '', new_password: '', confirm_password: '' },
    });

    const onFormSubmit = async (data: ChangePasswordFormData) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <Lock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Password Security</h3>
                            <p className="text-sm text-muted-foreground">
                                Ensure your account is using a strong password to stay secure
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="current_password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    {...register('current_password')}
                                    placeholder="Enter current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.current_password && (
                                <p className="text-sm text-red-600">{errors.current_password.message}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new_password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...register('new_password')}
                                    placeholder="Enter new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.new_password && (
                                <p className="text-sm text-red-600">{errors.new_password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirm_password')}
                                    placeholder="Confirm new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 kio-btn-ai-primary">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Password Requirements */}
            <Card>
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">Password Requirements</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                            'Minimum 8 characters long',
                            'At least one uppercase letter',
                            'At least one lowercase letter',
                            'At least one number',
                        ].map((req) => (
                            <li key={req} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
