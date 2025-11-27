import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUsers } from '@/interfaces/lib/users';
import { prisma } from '@/interfaces/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password, name, phone, typeAccount } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

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
      id: 0,
      email,
      password: hashedPassword,
      name,
      typeAccount: typeAccount || 'peopleNatural',
      country: ''
    });

    const tokenData = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'user',
    };

    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: newUser,
      token
    }, { status: 201 });

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