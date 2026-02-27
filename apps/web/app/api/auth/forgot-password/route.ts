import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import crypto from 'crypto';

const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  country: z.string().min(2).max(50).default('colombia'),
});

/**
 * POST /api/auth/forgot-password
 *
 * Genera un token de reseteo y envía el email.
 * Siempre responde 200 OK aunque el email no exista (anti user-enumeration).
 * Rate limited: 3 intentos por IP cada 15 minutos.
 */
export async function POST(request: NextRequest) {
  // Rate limiting estricto — evita flood de emails
  const { allowed, response: rateLimitResponse } = rateLimit(request, {
    limit: 3,
    windowSec: 15 * 60,
  });
  if (!allowed) return rateLimitResponse!;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Si ese email existe, recibirás un correo pronto.' });
    }

    const { email, country } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // ⚠️ Siempre respondemos igual, exista o no el usuario (anti-enumeration)
    const genericResponse = NextResponse.json({
      message: 'Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.',
    });

    if (!user) return genericResponse;

    // Invalidar tokens previos no usados del mismo usuario
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Generar token seguro (32 bytes = 64 chars hex)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
      data: {
        token: rawToken,
        userId: user.id,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      },
    });

    // Enviar email de forma no bloqueante
    void sendPasswordResetEmail(user.email, user.name, rawToken, country);

    return genericResponse;
  } catch (error) {
    console.error('[forgot-password] Error:', error);
    return NextResponse.json({
      message: 'Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.',
    });
  }
}