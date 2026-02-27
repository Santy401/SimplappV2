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

    const company = user.companies[0]?.company;
    if (!company) {
      return NextResponse.json({ error: 'Compañía original no encontrada para este usuario' }, { status: 404 });
    }

    const companyData = {
      id: company.id,
      companyName: company.companyName,
      companyLogo: null, // No devolver Base64 en GET — puede ser enorme
      userType: 'owner', // Default as it's not a company field
      legalName: company.commercialName,
      businessType: null, // Was removed from schema, not needed by DIAN
      industry: company.economicActivity,
      taxIdentification: company.identificationNumber,
      taxRegime: company.vatCondition,
      taxResponsibilities: null, // Removed
      state: company.department,
      city: company.municipality,
      address: company.address,
      zipCode: company.postalCode,
      currency: company.currency,
      invoicePrefix: company.invoicePrefix,
      invoiceInitialNumber: company.invoiceInitialNumber,
      defaultTax: company.defaultTax,
      phone: company.phone,
      billingEmail: company.email,
      website: company.website,
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
    const companyId = user.companies[0]?.companyId;
    if (!companyId) {
      return NextResponse.json({ error: 'Compañía original no encontrada' }, { status: 404 });
    }

    const body = await request.json();

    const companyUpdateData: Record<string, unknown> = {};

    // Mapping payload fields to Company schema fields
    const fieldMapping: Record<string, string> = {
      companyName: 'companyName',
      legalName: 'commercialName',
      industry: 'economicActivity',
      taxIdentification: 'identificationNumber',
      taxRegime: 'vatCondition',
      state: 'department',
      city: 'municipality',
      address: 'address',
      zipCode: 'postalCode',
      currency: 'currency',
      invoicePrefix: 'invoicePrefix',
      invoiceInitialNumber: 'invoiceInitialNumber',
      defaultTax: 'defaultTax',
      phone: 'phone',
      billingEmail: 'email',
      website: 'website'
    };

    for (const [bodyField, dbField] of Object.entries(fieldMapping)) {
      if (bodyField in body && body[bodyField] !== undefined) {
        companyUpdateData[dbField] = body[bodyField];
      }
    }

    // Validaciones específicas
    if (companyUpdateData.defaultTax !== undefined) {
      const taxStr = String(companyUpdateData.defaultTax);
      if (!/^\d+(\.\d+)?$/.test(taxStr)) {
        return NextResponse.json({ error: 'defaultTax debe ser un valor numérico' }, { status: 400 });
      }
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: companyUpdateData,
    });

    const { logoUrl: _logo, ...safeCompany } = updatedCompany;

    return NextResponse.json({
      company: safeCompany,
      message: 'Empresa actualizada exitosamente',
    });
  } catch (error) {
    console.error('Update company error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}