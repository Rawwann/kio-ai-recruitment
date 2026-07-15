import { useState, useEffect } from 'react';
import {
    getCandidateProfile,
    updateCandidateProfile,
    uploadCandidateCV,
    changeCandidatePassword,
} from '@/lib/api/candidateService';
import type {
    UserProfile,
    UpdateProfilePayload,
    ChangePasswordPayload,
} from '@/types/candidate';

export function useCandidateProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCandidateProfile();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (payload: UpdateProfilePayload) => {
        try {
            setUpdating(true);
            setError(null);
            const updatedProfile = await updateCandidateProfile(payload);
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    const uploadCV = async (file: File) => {
        try {
            setUpdating(true);
            setError(null);
            const response = await uploadCandidateCV(file);
            if (profile) {
                setProfile({
                    ...profile,
                    cv_file_name:  response.file_name,
                    cv_uploaded_at: response.uploaded_at,
                    cv_file_url:   response.file_url || profile.cv_file_url,
                    // BUG-4.13: auto-populate role from CV parser
                    ...(response.parsed_role ? { role: response.parsed_role } : {}),
                });
            }
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload CV';
            setError(errorMessage);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    const changePassword = async (payload: ChangePasswordPayload) => {
        try {
            setUpdating(true);
            setError(null);
            await changeCandidatePassword(payload);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
            setError(errorMessage);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    return {
        profile,
        loading,
        error,
        updating,
        updateProfile,
        uploadCV,
        changePassword,
        refetch: fetchProfile,
    };
}
