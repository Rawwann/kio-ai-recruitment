'use client';

import { toast } from 'sonner';
import { User, Briefcase, FileText, Lock, Github, UserCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Skeleton } from '@/components/ui/feedback/skeleton';
import { Tabs, TabsContent } from '@/components/ui/layout/tabs';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ProfileSidebar } from '@/components/features/candidates/ProfileSidebar';
import { PersonalInfoForm } from '@/components/features/candidates/PersonalInfoForm';
import { ProfessionalForm } from '@/components/features/candidates/ProfessionalForm';
import { CVUpload } from '@/components/features/candidates/CVUpload';
import { ChangePasswordForm } from '@/components/features/candidates/ChangePasswordForm';
import { MagicSearchBar } from '@/components/features/company/CompanySearchBar';
import { GitHubConnection } from '@/components/features/candidates/GitHubConnection';
import { useCandidateProfile } from '@/hooks/candidates/useCandidateProfile';
import { motion } from "framer-motion";
import { NotificationBell } from "@/components/features/dashboard/NotificationBell";

export default function ProfilePage() {
    const { profile, loading, updating, updateProfile, uploadCV, changePassword } = useCandidateProfile();

    const handlePersonalInfoSubmit = async (data: any) => {
        try {
            await updateProfile(data);
            toast.success('Personal information updated successfully!');
        } catch {
            toast.error('Failed to update personal information');
        }
    };

    const handleProfessionalSubmit = async (data: any) => {
        try {
            await updateProfile(data);
            toast.success('Professional details updated successfully!');
        } catch {
            toast.error('Failed to update professional details');
        }
    };

    const handleCVUpload = async (file: File) => {
        try {
            await uploadCV(file);
            toast.success('CV uploaded successfully!');
        } catch {
            toast.error('Failed to upload CV');
        }
    };

    const handlePasswordChange = async (data: any) => {
        try {
            await changePassword(data);
            toast.success('Password changed successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="pt-6">
                                <Skeleton className="h-10 w-full mb-6" />
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-16 w-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                    <div className="w-full space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Profile not found
    if (!profile) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Profile not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <UserCircle size={20} />
                        </div>
                        Profile Settings
                    </h1>

                    <p className="text-muted-foreground">Manage your personal information and account settings</p>
                </div>
                <div className="flex items-center gap-3 relative z-[50]">
                    <MagicSearchBar />
                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                        <NotificationBell
                            buttonClassName={[
                                "w-9 h-9 rounded-lg border border-gray-200 bg-white/80",
                                "flex items-center justify-center",
                                "hover:border-purple-300 hover:bg-purple-50 transition-colors",
                                "text-gray-600",
                            ].join(" ")}
                            dotClassName="top-1.5 right-1.5 bg-purple-600 border-0 ring-2 ring-white"
                            iconClassName="size-4"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content — Left Side (2/3 width) */}
                <div className="lg:col-span-2">
                    <Card className="shadow-sm">
                        <CardContent className="p-0">
                            <Tabs defaultValue="personal" className="w-full">
                                {/* Tab bar — Radix primitive, full-width spread */}
                                <div className="border-b border-gray-200 dark:border-neutral-700 px-6 pt-6">
                                    <div className="overflow-x-auto lg:overflow-visible">
                                        <TabsPrimitive.List className="flex min-w-max justify-start bg-transparent lg:w-full lg:min-w-0 lg:justify-between">
                                        {[
                                            { value: 'personal', label: 'Personal Info' },
                                            { value: 'professional', label: 'Professional' },
                                            { value: 'cv', label: 'CV / Resume' },
                                            { value: 'security', label: 'Security' },
                                            { value: 'github', label: 'GitHub' },
                                        ].map(({ value, label }) => (
                                            <TabsPrimitive.Trigger
                                                key={value}
                                                value={value}
                                                className={[
                                                    // Layout — mobile scrolls; desktop spreads tabs evenly across full width
                                                    'flex-none px-4 pb-3 text-center whitespace-nowrap lg:flex-1 lg:px-0',
                                                    // Typography
                                                    'text-sm font-medium',
                                                    // Clean slate: border-0 keeps border-style:solid (unlike
                                                    // border-none which sets style:none and breaks border-b-2)
                                                    'border-0 border-solid',
                                                    'bg-transparent shadow-none rounded-none outline-none',
                                                    // Inactive
                                                    'text-gray-500 transition-colors hover:text-gray-900',
                                                    'dark:text-neutral-400 dark:hover:text-neutral-100',
                                                    'focus-visible:outline-none',
                                                    // Active — bottom underline only, no box
                                                    'data-[state=active]:border-b-2',
                                                    'data-[state=active]:border-purple-600',
                                                    'data-[state=active]:text-purple-600',
                                                    'data-[state=active]:bg-transparent',
                                                    'data-[state=active]:shadow-none',
                                                    // Dark active
                                                    'dark:data-[state=active]:border-purple-400',
                                                    'dark:data-[state=active]:text-purple-400',
                                                ].join(' ')}
                                            >
                                                {label}
                                            </TabsPrimitive.Trigger>
                                        ))}
                                        </TabsPrimitive.List>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <TabsContent value="personal" className="mt-0">
                                        <PersonalInfoForm
                                            profile={profile}
                                            onSubmit={handlePersonalInfoSubmit}
                                            isSubmitting={updating}
                                        />
                                    </TabsContent>

                                    <TabsContent value="professional" className="mt-0">
                                        <ProfessionalForm
                                            profile={profile}
                                            onSubmit={handleProfessionalSubmit}
                                            isSubmitting={updating}
                                        />
                                    </TabsContent>

                                    <TabsContent value="cv" className="mt-0">
                                        <CVUpload
                                            profile={profile}
                                            onUpload={handleCVUpload}
                                            isUploading={updating}
                                        />
                                    </TabsContent>

                                    <TabsContent value="security" className="mt-0">
                                        <ChangePasswordForm
                                            onSubmit={handlePasswordChange}
                                            isSubmitting={updating}
                                        />
                                    </TabsContent>

                                    <TabsContent value="github" className="mt-0">
                                        <GitHubConnection />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar — Right Side (1/3 width) */}
                <div className="lg:col-span-1">
                    <ProfileSidebar profile={profile} />
                </div>
            </div>
        </div>
    );
}
