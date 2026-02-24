export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    typeAccount: string;
    country: string;
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