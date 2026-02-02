import z from "zod";

export const authSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const requestSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    details: z.string().min(3, "Please provide more details"),
});

export const companySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    region: z.string().min(1, "Region is required"),
    address: z.string().optional(),
    contact_email: z.email("Invalid contact email"),
    contact_phone: z.string().optional(),
    logo_url: z.string().optional().or(z.literal("")),
});

export const statusSchema = z.enum([
    "open",
    "in_progress",
    "in_review",
    "closed",
]);
