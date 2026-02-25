/**
 * /api/company — CRUD de configuración de empresa
 *
 * ⚠️ NOTA DE ARQUITECTURA:
 * Los campos de empresa (companyName, currency, invoicePrefix, etc.) actualmente
 * viven en el modelo User. Esta es una deuda técnica conocida (ver LISTA_DE_TAREAS.md).
 * Este endpoint actualiza esos campos en User hasta que se implemente la migración
 * a Company como entidad separada.
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';
import { verifyCsrf } from '@/lib/csrf';

async function getAuthenticatedUser(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;

  if (!accessToken) return { error: 'No autenticado', status: 401 };

  const payload = await verifyAccessToken(accessToken) as { id: string } | null;
  if (!payload?.id) return { error: 'Token inválido', status: 401 };

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: { companies: { include: { company: true } } },
  });

  if (!user) return { error: 'Usuario no encontrado', status: 404 };
  return { user };
}

/**
 * GET /api/company
 * Retorna los datos de configuración de empresa del usuario actual
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    // Construir el objeto de empresa desde los campos del User (deuda técnica conocida)
    const companyData = {
      id: user.id,
      companyName: user.companyName,
      companyLogo: null, // No devolver Base64 en GET — puede ser enorme
      userType: user.userType,
      legalName: user.legalName,
      businessType: user.businessType,
      industry: user.industry,
      taxIdentification: user.taxIdentification,
      taxRegime: user.taxRegime,
      taxResponsibilities: user.taxResponsibilities,
      state: user.state,
      city: user.city,
      address: user.address,
      zipCode: user.zipCode,
      currency: user.currency,
      invoicePrefix: user.invoicePrefix,
      invoiceInitialNumber: user.invoiceInitialNumber,
      defaultTax: user.defaultTax,
      phone: user.phone,
      billingEmail: user.billingEmail,
      website: user.website,
      country: user.country,
    };

    return NextResponse.json({ company: companyData });
  } catch (error) {
    console.error('Get company error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * PUT /api/company
 * Actualiza la configuración de empresa del usuario
 */
export async function PUT(request: NextRequest) {
  // CSRF protection — actualizar información fiscal es una mutación sensible
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const auth = await getAuthenticatedUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;
    const body = await request.json();

    // Lista blanca de campos permitidos (evitar mass assignment)
    const allowedFields = [
      'companyName', 'legalName', 'businessType', 'industry',
      'taxIdentification', 'taxRegime', 'taxResponsibilities',
      'state', 'city', 'address', 'zipCode',
      'currency', 'invoicePrefix', 'invoiceInitialNumber',
      'defaultTax', 'phone', 'billingEmail', 'website', 'country',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body && body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Validaciones específicas
    if (updateData.defaultTax !== undefined) {
      const taxStr = String(updateData.defaultTax);
      if (!/^\d+(\.\d+)?$/.test(taxStr)) {
        return NextResponse.json({ error: 'defaultTax debe ser un valor numérico' }, { status: 400 });
      }
    }

    // No permitir actualizar el logo por este endpoint (tiene su propio flujo)
    delete (updateData as any).companyLogo;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const { companyLogo: _logo, password: _pw, ...safeUser } = updatedUser;

    return NextResponse.json({
      company: safeUser,
      message: 'Empresa actualizada exitosamente',
    });
  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}