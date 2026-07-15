'use client';

import { Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/data-display/avatar';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Progress } from '@/components/ui/feedback/progress';
import { Badge } from '@/components/ui/data-display/badge';
import type { UserProfile } from '@/types/candidate';

interface ProfileSidebarProps {
    profile: UserProfile;
}

export function ProfileSidebar({ profile }: ProfileSidebarProps) {
    const initials = profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-6">
            {/* Main Profile Card */}
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-purple-100">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 text-white text-2xl font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name & Role */}
                        <div>
                            <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                            <p className="text-sm text-purple-600 mt-1 font-medium">
                                {profile.role || 'Developer'}
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground px-2">
                            Passionate developer focused on building innovative solutions and delivering exceptional user experiences.
                        </p>

                        {/* Contact Info */}
                        <div className="w-full space-y-3 text-sm pt-4 border-t">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                <span className="text-left truncate">{profile.address.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Briefcase className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                <span className="text-left">{profile.years_of_experience} Years Experience</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                <span className="text-left">Joined 2024</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Completion Card */}
            <div className="group rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-800 via-violet-600 to-[#d97706] p-5 text-white text-center shadow-md transition-all duration-500 hover:bg-gradient-to-tl hover:from-[#d97706] hover:via-violet-600 hover:to-purple-800 hover:shadow-lg hover:scale-[102%]">                <div className="space-y-4">
                <div>
                    <p className="text-xs font-semibold text-purple-200 uppercase tracking-widest mb-1">Profile Completion</p>
                    <div className="text-4xl font-black mb-1">
                        {profile.profile_completion_percentage}%
                    </div>
                    <p className="text-xs text-purple-200">
                        {profile.profile_completion_percentage < 100
                            ? 'Almost there! Complete your profile'
                            : 'Your profile is complete!'}
                    </p>
                </div>
                <Progress value={profile.profile_completion_percentage} className="h-2 bg-white/20" />
            </div>
            </div>

            {/* Skills Tags */}
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.slice(0, 6).map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                    {profile.skills.length > 6 && (
                        <p className="text-xs text-muted-foreground mt-3">
                            +{profile.skills.length - 6} more skills
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
