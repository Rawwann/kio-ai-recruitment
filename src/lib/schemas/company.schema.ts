import { z } from "zod";

export const companyProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    website: z.string().url("Please enter a valid URL."),
    location: z.string().min(1, "Location is required."),
    industry: z.string().min(1, "Industry is required."),
    foundedYear: z.number().min(1800, "Must be at least 1800.").max(new Date().getFullYear(), "Cannot be in the future."),
    size: z.string(),
    about: z.string().min(50, "About must be at least 50 characters for a professional description."),
    tags: z.array(z.string()),
    logoUrl: z.string().optional(),
});

export const linkedInSyncSchema = z.object({
    // Accepts all common LinkedIn company URL formats:
    //   https://www.linkedin.com/company/name
    //   https://linkedin.com/company/name/
    //   https://www.linkedin.com/company/name/about
    //   linkedin.com/company/my-company-name
    url: z.string().regex(
        /linkedin\.com\/company\/[\w-]+/i,
        "Must be a valid LinkedIn company URL (e.g. linkedin.com/company/your-company)",
    ),
});
