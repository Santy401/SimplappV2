import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUsers } from '@interfaces/lib/users';
import { prisma } from '@interfaces/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@interfaces/lib/auth/token';
import { rateLimit } from '@/lib/rate-limit';
import { parseBody, registerApiSchema } from '@/lib/api-schemas';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en la plataforma
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // ─── Rate Limiting: 5 registros por IP cada hora ─────────────────────────
  const { allowed, response: rateLimitResponse } = rateLimit(request, {
    limit: 5,
    windowSec: 60 * 60,
  });
  if (!allowed) return rateLimitResponse!;

  try {
    const body = await request.json();

    // ─── Validación con Zod ───────────────────────────────────────────────
    const parsed = parseBody(body, registerApiSchema);
    if (!parsed.success) return parsed.errorResponse;
    const { email, password, name, phone, typeAccount } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await createUsers({
      email,
      password: hashedPassword,
      name,
      typeAccount: typeAccount || 'peopleNatural',
      country: ''
    });

    const accessToken = await generateAccessToken(newUser.id, newUser.email);
    const refreshToken = await generateRefreshToken(newUser.id);

    // Enviar email de bienvenida de forma no bloqueante
    void sendWelcomeEmail(newUser.email, newUser.name);

    // Domain para cookies cross-subdomain — igual que en login
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      ...(cookieDomain && { domain: cookieDomain }),
    };

    const response = NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: newUser,
      token: accessToken
    }, { status: 201 });

    response.cookies.set('access-token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutos
    });

    response.cookies.set('refresh-token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en /api/auth/register:', error);

    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}