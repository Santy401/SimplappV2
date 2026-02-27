/**
 * Zod schemas para validación server-side en las rutas de API.
 * Estos son distintos a los schemas de formulario del cliente (auth.schema.ts)
 * porque el servidor debe ser más estricto y no confiar en el input del cliente.
 *
 * Compatible con Zod v4
 */
import { z } from 'zod';
import { NextResponse } from 'next/server';

// ─── Auth ────────────────────────────────────────────────────────────────────

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

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingApiSchema = z.object({
    userType: z.string().min(1).max(50),
    companyName: z.string().min(2, 'Nombre comercial requerido').max(200).trim(),
    country: z.string().min(2).max(100).trim(),
    currency: z.enum(['COP', 'USD', 'EUR', 'MXN', 'PEN', 'CLP', 'ARS']),
    companyLogo: z.string().optional(),
    invoicePrefix: z.string().min(1).max(4).trim(),
    defaultTax: z.string().regex(/^\d+(\.\d+)?$/, 'Impuesto debe ser numérico').max(5),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Parsea y valida datos con un Zod schema.
 * En caso de error, devuelve un NextResponse 400 con los mensajes de validación.
 *
 * @example
 * const parsed = parseBody(body, loginApiSchema);
 * if (!parsed.success) return parsed.errorResponse;
 * const { email, password } = parsed.data;
 */
export function parseBody<T>(
    body: unknown,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errorResponse: NextResponse } {
    const result = schema.safeParse(body);
    if (!result.success) {
        // Zod v4 usa .issues, Zod v3 usa .errors — soportamos ambos
        const issues = (result.error as any).issues ?? (result.error as any).errors ?? [];
        const errors = issues.map((issue: { path: (string | number)[]; message: string }) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return {
            success: false,
            errorResponse: NextResponse.json(
                { error: errors[0]?.message ?? 'Datos inválidos', errors },
                { status: 400 }
            ),
        };
    }
    return { success: true, data: result.data };
}
