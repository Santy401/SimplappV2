/**
 * Utilidades de sanitización de input para proteger contra XSS
 * y otros ataques de inyección en campos de texto libre.
 *
 * No se usa una librería externa deliberadamente para mantener el bundle pequeño —
 * estas funciones cubren los casos más comunes en un contexto de SaaS B2B.
 */

/** Caracteres HTML especiales que se deben escapar */
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
};

/**
 * Escapa caracteres HTML peligrosos en un string.
 * Usar en campos que NO aceptan HTML como input (nombres, direcciones, notas, etc.)
 */
export function escapeHtml(str: string): string {
    return str.replace(/[&<>"'/]/g, char => HTML_ENTITIES[char] ?? char);
}

/**
 * Limpia un string: trim + colapsa espacios múltiples + escapa HTML.
 * Uso ideal: campos de texto de formularios del dashboard.
 */
export function sanitizeText(value: unknown): string {
    if (typeof value !== 'string') return '';
    return escapeHtml(value.trim().replace(/\s+/g, ' '));
}

/**
 * Sanitiza un email: lowercase + trim.
 * No escapa HTML porque los emails no se renderizan como HTML.
 */
export function sanitizeEmail(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.trim().toLowerCase();
}

/**
 * Sanitiza un número de teléfono: solo deja dígitos, +, -, espacios y paréntesis.
 */
export function sanitizePhone(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/[^0-9+\-\s()]/g, '');
}

/**
 * Sanitiza un objeto completo aplicando `sanitizeText` a todos sus string values.
 * Útil para limpiar el body de un request antes de guardarlo en la base de datos.
 *
 * @example
 * const clean = sanitizeObject(req.body);
 * await prisma.client.create({ data: clean });
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeText(value);
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = sanitizeObject(value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }
    return result as T;
}
