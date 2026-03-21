/**
 * Zod schemas para validación server-side en las rutas de API.
 * Centralizados desde @simplapp/domain
 */
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Re-exportamos desde @simplapp/domain para mantener compatibilidad con imports existentes
export { 
    loginApiSchema, 
    registerApiSchema, 
    onboardingApiSchema 
} from '@simplapp/domain';

/**
 * Parsea y valida datos con un Zod schema.
 * En caso de error, devuelve un NextResponse 400 con los mensajes de validación.
 */
export function parseBody<T>(
    body: unknown,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errorResponse: NextResponse } {
    const result = schema.safeParse(body);
    if (!result.success) {
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
