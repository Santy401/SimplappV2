export enum OrganizationType {
  NATURAL_PERSON = 'NATURAL_PERSON',
  PERSON_JURIDIC = 'PERSON_JURIDIC'
}

export enum IdentificationType {
  CITIZEN_ID = 'CITIZEN_ID',
  NIT = 'NIT',
  PASSPORT = 'PASSPORT',
  TAX_ID = 'TAX_ID',
  FOREIGN_ID = 'FOREIGN_ID'
}

export interface Client {
  id: number;
  
  organizationType: OrganizationType;
  firstLastName: string;
  secondLastName?: string | null;
  firstName: string;
  otherNames?: string | null;
  commercialName?: string | null;
  code?: string | null;
  
  identificationType: IdentificationType;
  identificationNumber: string;
  
  email?: string | null;
  includeCcBcc: boolean;
  phone?: string | null;
  
  country: string;
  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  address?: string | null;
  
  is_supplier: boolean;
  it_branches: boolean;
  observations?: string | null;
  
  bills: [];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDto {
  organizationType: OrganizationType;
  firstLastName: string;
  secondLastName?: string | null;
  firstName: string;
  otherNames?: string | null;
  commercialName?: string | null;
  code?: string | null;
  
  identificationType: IdentificationType;
  identificationNumber: string;
  
  email?: string | null;
  includeCcBcc?: boolean;
  phone?: string | null;
  
  country: string;
  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  address?: string | null;
  
  is_supplier?: boolean;
  it_branches?: boolean;
  observations?: string | null;
}

export interface UpdateClientDto {
  organizationType?: OrganizationType;
  firstLastName?: string;
  secondLastName?: string | null;
  firstName?: string;
  otherNames?: string | null;
  commercialName?: string | null;
  code?: string | null;
  
  identificationType?: IdentificationType;
  identificationNumber?: string;
  
  email?: string | null;
  includeCcBcc?: boolean;
  phone?: string | null;
  
  country?: string;
  department?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  address?: string | null;
  
  is_supplier?: boolean;
  it_branches?: boolean;
  observations?: string | null;
}

export interface ClientFilter {
  id?: number;
  organizationType?: OrganizationType;
  firstName?: string;
  firstLastName?: string;
  identificationNumber?: string;
  email?: string;
  phone?: string;
  country?: string;
  department?: string;
  municipality?: string;
  is_supplier?: boolean;
  it_branches?: boolean;
  
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedClientResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
