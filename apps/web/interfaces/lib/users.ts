import { prisma } from './prisma';
import { User as Data } from '@/domain/entities/User.entity'
import { Company as CompanyData, OrganizationType, VatCondition } from '@/domain/entities/Company.entity'

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            where: {
                company: {
                    isNot: null
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                typeAccount: true,
                country: true,
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        commercialName: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        return users;
    } catch (error) {
        console.error('Error obteniendo usuarios de la DB:', error);
        throw error;
    }
}

export async function createUsers(User: Data, Company?: Partial<CompanyData>) {
    try {
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: User.name,
                    email: User.email,
                    password: User.password,
                    typeAccount: User.typeAccount,
                    country: User.country,
                }
            });

            const companyData = {
                userId: user.id,
                companyName: Company?.companyName || "",
                commercialName: Company?.commercialName || null,
                organizationType: Company?.organizationType || OrganizationType.COMPANY, // Usar el enum
                vatCondition: Company?.vatCondition || VatCondition.SIMPLIFIED_REGIME, // Usar el enum
                identificationNumber: Company?.identificationNumber || "",
                address: Company?.address || "",
                verificationDigit: Company?.verificationDigit || null,
                accountId: Company?.accountId || null,
                economicActivity: Company?.economicActivity || null,
                industryAndCommerceTax: Company?.industryAndCommerceTax || false,
                department: Company?.department || null,
                municipality: Company?.municipality || null,
                postalCode: Company?.postalCode || null,
                phone: Company?.phone || null,
                email: Company?.email || null,
            };

            const company = await tx.company.create({
                data: companyData
            });

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                typeAccount: user.typeAccount,
                country: user.country,
                company: {
                    id: company.id,
                    companyName: company.companyName,
                    commercialName: company.commercialName
                }
            };
        });

        return newUser;
    } catch (error) {
        console.error('Error al crear usuario en la DB:', error);
        throw error;
    }
}

export async function validateUserHasCompany(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true }
    });

    if (!user?.company) {
        throw new Error('El usuario no tiene empresa asignada. Complete los datos de empresa.');
    }

    return user;
}