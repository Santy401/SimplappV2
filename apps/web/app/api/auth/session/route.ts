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
  companyId?: string;
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
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData: SessionResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      typeAccount: user.typeAccount,
      country: user.country,
      companyId: user.company?.id,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      userType: user.userType,
      onboardingCompleted: user.onboardingCompleted,
      profileLogo: user.profileLogo,
      language: user.language,
      timezone: user.timezone,
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