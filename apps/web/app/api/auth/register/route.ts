import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUsers } from '@interfaces/lib/users';
import { prisma } from '@interfaces/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseBody, registerApiSchema } from '@/lib/api-schemas';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

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

    // Generate Verification Token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await prisma.emailVerificationToken.create({
      data: {
        token: verifyToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    });

    // Enviar email de bienvenida de forma no bloqueante
    void sendWelcomeEmail(newUser.email, newUser.name);
    // Enviar email de verificacion
    void sendVerificationEmail(newUser.email, newUser.name, verifyToken, ''); // TODO: pass correct country if available

    const response = NextResponse.json({
      message: 'Te hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada antes de iniciar sesión.',
      user: newUser
    }, { status: 201 });

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