import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { prisma } from '@interfaces/lib/prisma';

export interface SessionResponse {
  id: string;
  email: string;
  name: string;
  typeAccount: string;
  country: string;
  companyId: string;
  companyName?: string | null;
  companyLogo?: string | null;
  userType?: string | null;
  onboardingCompleted?: boolean;
  profileLogo?: string | null;
  language?: string | null;
  timezone?: string | null;
  legalName?: string | null;
  businessType?: string | null;
  industry?: string | null;
  taxIdentification?: string | null;
  taxRegime?: string | null;
  taxResponsibilities?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  zipCode?: string | null;
  currency?: string | null;
  invoicePrefix?: string | null;
  invoiceInitialNumber?: number | null;
  defaultTax?: string | null;
  phone?: string | null;
  billingEmail?: string | null;
  website?: string | null;
  companies?: Array<{
    id: string;
    companyName: string;
    role: string;
  }>;
}

/**
 * GET /api/auth/session
 * Verifica el access token y retorna los datos del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(accessToken) as { id: string };

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: { companies: { include: { company: true } } },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentCompanyEntry = user.lastCompanyId
      ? user.companies.find((uc: { companyId: string; company: any; role: string }) => uc.companyId === user.lastCompanyId)
      : user.companies[0];
    const currentCompany = currentCompanyEntry?.company;

    const userData: SessionResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      typeAccount: user.typeAccount,
      country: user.country,
      companyId: currentCompany?.id,
      companyName: currentCompany?.companyName,
      // ⚠️ companyLogo se omite intencionalmente: puede ser un Base64 de cientos de KB.
      // Cargarlo en cada query de sesión degrada el rendimiento del dashboard.
      // TODO: Migrar logos a Supabase Storage y devolver solo la URL.
      companyLogo: null,
      userType: currentCompanyEntry?.role === 'OWNER' ? 'owner' : currentCompanyEntry?.role,
      onboardingCompleted: user.onboardingCompleted,
      profileLogo: user.profileLogo,
      language: user.language,
      timezone: user.timezone,
      legalName: currentCompany?.commercialName,
      businessType: null,
      industry: currentCompany?.economicActivity,
      taxIdentification: currentCompany?.identificationNumber,
      taxRegime: currentCompany?.vatCondition,
      taxResponsibilities: null,
      state: currentCompany?.department,
      city: currentCompany?.municipality,
      address: currentCompany?.address,
      zipCode: currentCompany?.postalCode,
      currency: currentCompany?.currency,
      invoicePrefix: currentCompany?.invoicePrefix,
      invoiceInitialNumber: currentCompany?.invoiceInitialNumber,
      defaultTax: currentCompany?.defaultTax,
      phone: currentCompany?.phone,
      billingEmail: currentCompany?.email,
      website: currentCompany?.website,
      companies: user.companies.map((uc: any) => ({
        id: uc.company.id,
        companyName: uc.company.companyName,
        role: uc.role
      }))
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}