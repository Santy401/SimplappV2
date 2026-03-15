import { z } from 'zod';

export const loginApiSchema = z.object({
    email: z
        .string()
        .min(1, 'Email requerido')
        .email('Formato de email inválido')
        .max(320, 'Email demasiado largo')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Contraseña requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
});

export const registerApiSchema = z.object({
    email: z
        .string()
        .min(1, 'Email requerido')
        .email('Formato de email inválido')
        .max(320, 'Email demasiado largo')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Contraseña requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
    name: z
        .string()
        .min(1, 'Nombre requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'Nombre demasiado largo')
        .trim(),
    phone: z.string().max(30, 'Teléfono demasiado largo').optional(),
    typeAccount: z.string().max(50).optional(),
    acceptTerms: z.boolean().optional(),
});

export type LoginApiInput = z.infer<typeof loginApiSchema>;
export type RegisterApiInput = z.infer<typeof registerApiSchema>;
