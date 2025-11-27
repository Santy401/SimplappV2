import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';

// Mock database
const users = [
  {
    id: 'user_123',
    email: 'demo@empresa.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/eoM3s4.SQ7xk9BfWS',
    name: 'Usuario Demo',
    phone: '+573001234567',
    role: 'admin',
    onboardingCompleted: false,
    companyId: 'company_123',
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = Buffer.from(JSON.stringify({ 
      userId: user.id, 
      email: user.email 
    })).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}