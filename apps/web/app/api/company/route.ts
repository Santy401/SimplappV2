import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const companies: any[] = [];
const users = [
  {
    id: 'user_123',
    email: 'demo@empresa.com',
    name: 'Usuario Demo',
    companyId: null,
  }
];

/**
 * GET /api/company
 * Obtiene la información de la empresa del usuario actual
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const tokenData = JSON.parse(Buffer.from(token.value, 'base64').toString());
    const userId = tokenData.userId;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (!user.companyId) {
      return NextResponse.json({ company: null });
    }

    const company = companies.find(c => c.id === user.companyId);
    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });

  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/company
 * Crea una nueva empresa asociada al usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const tokenData = JSON.parse(Buffer.from(token.value, 'base64').toString());
    const userId = tokenData.userId;

    const {
      companyName,
      legalName,
      taxId,
      address,
      phone,
      email,
      industry,
      currency,
      website,
      country
    } = body;

    if (!companyName || !legalName || !taxId) {
      return NextResponse.json(
        { error: 'Nombre comercial, razón social y NIT son requeridos' },
        { status: 400 }
      );
    }

    const user = users.find(u => u.id === userId);
    if (user?.companyId) {
      return NextResponse.json(
        { error: 'El usuario ya tiene una empresa configurada' },
        { status: 400 }
      );
    }

    const existingCompany = companies.find(c => c.taxId === taxId);
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Ya existe una empresa con este NIT' },
        { status: 409 }
      );
    }

    const newCompany = {
      id: `company_${Date.now()}`,
      userId,
      companyName,
      legalName,
      taxId,
      address: address || '',
      phone: phone || '',
      email: email || '',
      industry: industry || '',
      currency: currency || 'COP',
      website: website || '',
      country: country || 'Colombia',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    companies.push(newCompany);

    cookieStore.set('onboarding-completed', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      company: newCompany,
      message: 'Empresa configurada exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Create company error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/company
 * Actualiza la información de la empresa existente
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const tokenData = JSON.parse(Buffer.from(token.value, 'base64').toString());
    const userId = tokenData.userId;

    const user = users.find(u => u.id === userId);
    if (!user || !user.companyId) {
      return NextResponse.json(
        { error: 'No se encontró empresa para este usuario' },
        { status: 404 }
      );
    }

    const companyIndex = companies.findIndex(c => c.id === user.companyId);
    if (companyIndex === -1) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    companies[companyIndex] = {
      ...companies[companyIndex],
      ...body,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      company: companies[companyIndex],
      message: 'Empresa actualizada exitosamente'
    });

  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}