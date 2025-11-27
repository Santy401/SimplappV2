import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export interface SessionResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  companyId?: string;
  onboardingCompleted: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Aquí validarías el token y obtendrías los datos del usuario
    // Esto es un ejemplo:
    const userData: SessionResponse = {
      id: 'user-123',
      email: 'usuario@empresa.com',
      name: 'Juan Pérez',
      role: 'admin',
      companyId: 'company-456',
      onboardingCompleted: false,
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}