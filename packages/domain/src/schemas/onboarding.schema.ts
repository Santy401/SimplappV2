import { z } from 'zod';

export const onboardingApiSchema = z.object({
    userType: z.string().min(1).max(50),
    companyName: z.string().min(2, 'Nombre comercial requerido').max(200).trim(),
    country: z.string().min(2).max(100).trim(),
    currency: z.enum(['COP', 'USD', 'EUR', 'MXN', 'PEN', 'CLP', 'ARS']),
    companyLogo: z.string().optional(),
    invoicePrefix: z.string().min(1).max(4).trim(),
    defaultTax: z.string().regex(/^\d+(\.\d+)?$/, 'Impuesto debe ser numérico').max(5),
});

export type OnboardingApiInput = z.infer<typeof onboardingApiSchema>;
