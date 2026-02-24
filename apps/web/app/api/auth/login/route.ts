import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { generateAccessToken, generateRefreshToken } from '@interfaces/lib/auth/token';
import { logActivity } from '@interfaces/lib/activity-log';

/**
 * POST /api/auth/login
 * Inicia sesión de usuario y devuelve tokens de acceso
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { companies: true }
    });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Usuario inválido' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const accessToken = await generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
    });

    if (user.companies.length > 0) {
      logActivity({
        companyId: user.companies[0].companyId,
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        metadata: { source: 'WEB_LOGIN' },
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      });
    }

    response.cookies.delete('token');
    response.cookies.delete('auth-token');

    // Domain para cookies cross-subdomain (simplapp.com + app.simplapp.com)
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

    response.cookies.set('access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
      ...(cookieDomain && { domain: cookieDomain }),
    });

    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      ...(cookieDomain && { domain: cookieDomain }),
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}