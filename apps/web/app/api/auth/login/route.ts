import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@interfaces/lib/auth/token';
import { logActivity } from '@interfaces/lib/activity-log';
import { rateLimit } from '@/lib/rate-limit';
import { parseBody, loginApiSchema } from '@/lib/api-schemas';

/**
 * POST /api/auth/login
 * Inicia sesión de usuario y devuelve tokens de acceso
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ─── Rate Limiting: 10 intentos por IP cada 15 minutos ───────────────────
  const { allowed, response: rateLimitResponse } = rateLimit(req, {
    limit: 10,
    windowSec: 15 * 60,
  });
  if (!allowed) return rateLimitResponse!;

  try {
    const body = await req.json();

    // ─── Validación con Zod ───────────────────────────────────────────────
    const parsed = parseBody(body, loginApiSchema);
    if (!parsed.success) return parsed.errorResponse;
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { companies: true }
    });

    // Respuesta genérica: no revelar si el email existe o no (anti user-enumeration)
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
    }

    const accessToken = await generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    const cookieBase = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      ...(cookieDomain && { domain: cookieDomain }),
    };

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
    });

    // Limpiar cookies legadas
    response.cookies.set('token', '', { ...cookieBase, maxAge: 0 });
    response.cookies.set('auth-token', '', { ...cookieBase, maxAge: 0 });

    response.cookies.set('access-token', accessToken, {
      ...cookieBase,
      maxAge: 15 * 60, // 15 minutos
    });

    response.cookies.set('refresh-token', refreshToken, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    // Registrar actividad de forma no bloqueante
    if (user.companies.length > 0) {
      void logActivity({
        companyId: user.companies[0]!.companyId,
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        metadata: { source: 'WEB_LOGIN' },
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      });
    }

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}