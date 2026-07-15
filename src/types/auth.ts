import { z } from "zod";
import { loginSchema, candidateSchema, recruiterRegisterSchema } from "@/lib/schemas";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string;
    gender?: 'male' | 'female';
    dateOfBirth?: string;
    cvUrl?: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CandidateFormValues = z.infer<typeof candidateSchema>;
export type RecruiterFormValues = z.infer<typeof recruiterRegisterSchema>;
