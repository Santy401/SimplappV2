export enum OrganizationType {
  NATURAL_PERSON = "NATURAL_PERSON",
  LEGAL_ENTITY = "LEGAL_ENTITY",    
  COMPANY = "COMPANY"
}

export enum IdentificationType {
  CITIZEN_ID = "CITIZEN_ID",
  PASSPORT = "PASSPORT",
  TAX_ID = "TAX_ID",
  FOREIGN_ID = "FOREIGN_ID"
}

export enum VatCondition {
  RESPONSABLE = "RESPONSABLE",
  NO_RESPONSABLE = "NO_RESPONSABLE",
  EXENTO = "EXENTO",
  SIMPLIFIED_REGIME = "SIMPLIFIED_REGIME"
}

export interface Company {
  id: number;
  userId: number;
  
  companyName: string;
  commercialName?: string | null;
  organizationType: OrganizationType;
  vatCondition: VatCondition;
  accountId?: string | null;
  identificationNumber: string;
  address: string;

  verificationDigit?: string | null;

  lastAccountingClose?: Date | null;
  economicActivity?: string | null;
  industryAndCommerceTax: boolean;

  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;

  phone?: string | null;
  email?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  userId: number;
  companyName?: string;
  accountId?: string | null;
  commercialName?: string | null;
  organizationType?: OrganizationType;
  vatCondition?: VatCondition;
  identificationNumber?: string;
  verificationDigit?: string | null;
  lastAccountingClose?: Date | null;
  economicActivity?: string | null;
  industryAndCommerceTax?: boolean;
  address?: string;
  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface UpdateCompanyInput {
  companyName?: string;
  accountId?: string | null;
  commercialName?: string | null;
  organizationType?: OrganizationType;
  vatCondition?: VatCondition;
  identificationNumber?: string;
  verificationDigit?: string | null;
  lastAccountingClose?: Date | null;
  economicActivity?: string | null;
  industryAndCommerceTax?: boolean;
  address?: string;
  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface CompanyWithUser extends Company {
  user: {
    id: number;
    name: string;
    email: string;
    typeAccount: string;
    country: string;
  };
}

export interface CompanyBasic {
  id: number;
  companyName: string;
  commercialName?: string | null;
  identificationNumber: string;
  organizationType: OrganizationType;
}