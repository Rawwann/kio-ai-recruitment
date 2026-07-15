import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        firstName: z.string().min(3, "First name must be at least 3 characters").max(50),
        lastName: z.string().min(3, "Last name must be at least 3 characters").max(50),
        email: z.string().email("Invalid email"),
        phone: z.string().min(8, "Phone number must be valid"),
        password: z
            .string()
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                "Password must contain uppercase, lowercase, number, and special character"
            ),
        rePassword: z.string(),
        dateOfBirth: z.coerce
            .date()
            .refine((val) => new Date().getFullYear() - val.getFullYear() >= 16, "Age must be above 16")
            .transform((date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`),
        gender: z.enum(["male", "female"], { message: "Gender is required" }),
        terms: z
            .boolean()
            .refine((v) => v === true, { message: "You must accept the terms and conditions" }),
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });

export const recruiterRegisterSchema = z
    .object({
        companyName: z.string().min(2, "Company name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().min(8, "Phone number must be valid"),
        password: z
            .string()
            .regex(
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                "Password must contain uppercase, lowercase, number, and special character"
            ),
        rePassword: z.string(),
        terms: z
            .boolean()
            .refine((v) => v === true, { message: "You must accept the terms and conditions" }),
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });

export const candidateSchema = z.object({
    firstName: z.string()
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name must be at most 50 characters"),
    lastName: z.string()
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name must be at most 50 characters"),
    email: z.string()
        .email("Invalid email address"),
    phone: z.string().min(8, "Phone number must be valid"),
    password: z.string()
        .min(6, "Password must be at least 6 characters"),
    rePassword: z.string(),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    dateOfBirth: z.coerce
        .date()
        .refine((val) => new Date().getFullYear() - val.getFullYear() >= 16, "Age must be above 16")
        .transform((date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`),
    terms: z
        .boolean()
        .refine((v) => v === true, { message: "You must accept the terms and conditions" }),
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});
