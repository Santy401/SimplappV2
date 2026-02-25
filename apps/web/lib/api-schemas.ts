/**
 * Zod schemas para validación server-side en las rutas de API.
 * Estos son distintos a los schemas de formulario del cliente (auth.schema.ts)
 * porque el servidor debe ser más estricto y no confiar en el input del cliente.
 */
import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginApiSchema = z.object({
    email: z
        .string({ required_error: 'Email requerido' })
        .email('Formato de email inválido')
        .max(320, 'Email demasiado largo') // RFC 5321 max
        .toLowerCase()
        .trim(),
    password: z
        .string({ required_error: 'Contraseña requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
});

export const registerApiSchema = z.object({
    email: z
        .string({ required_error: 'Email requerido' })
        .email('Formato de email inválido')
        .max(320, 'Email demasiado largo')
        .toLowerCase()
        .trim(),
    password: z
        .string({ required_error: 'Contraseña requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'Contraseña demasiado larga'),
    name: z
        .string({ required_error: 'Nombre requerido' })
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
    companyLogo: z.string().max(2 * 1024 * 1024, 'Logo demasiado grande').optional(), // 2MB base64 max
    invoicePrefix: z.string().min(1).max(4).toUpperCase().trim(),
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
import { NextResponse } from 'next/server';

export function parseBody<T>(
    body: unknown,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errorResponse: NextResponse } {
    const result = schema.safeParse(body);
    if (!result.success) {
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
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
