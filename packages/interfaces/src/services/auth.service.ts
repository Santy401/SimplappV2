import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UserRepository } from '../repositories/user.repository';
import { RegisterApiInput } from '@simplapp/domain';

export class AuthService {
    /**
     * Lógica de registro de un nuevo usuario con empresa inicial.
     * Orquesta la transacción y la lógica de negocio de vinculación.
     */
    static async register(input: RegisterApiInput) {
        try {
            return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                // 1. Crear el usuario y la empresa inicial (paso atómico)
                const user = await UserRepository.create({
                    name: input.name,
                    email: input.email,
                    password: input.password, // Hash debe venir ya procesado o hacerse aquí si inyectamos un HashService
                    typeAccount: input.typeAccount || 'PERSONAL',
                    country: 'CO', // Valor por defecto inicial
                    lastCompanyId: "",
                    companies: {
                        create: {
                            role: 'OWNER',
                            company: {
                                create: {
                                    companyName: `${input.name} SAS`, // Nombre por defecto
                                    identificationNumber: "",
                                    address: ""
                                }
                            }
                        }
                    }
                }, tx);

                // 2. Vincular el lastCompanyId para la sesión inicial
                const companyId = user.companies[0].company.id;
                const finalUser = await UserRepository.update(user.id, {
                    lastCompanyId: companyId
                }, tx);

                return {
                    id: finalUser.id,
                    name: finalUser.name,
                    email: finalUser.email,
                    companyId: companyId
                };
            });
        } catch (error) {
            console.error('AuthService.register error:', error);
            throw new Error('No se pudo completar el registro del usuario.');
        }
    }

    /**
     * Valida si un usuario tiene una sesión activa y una empresa vinculada.
     */
    static async validateSession(userId: string) {
        const user = await UserRepository.findById(userId);
        if (!user || user.companies.length === 0) {
            throw new Error('Sesión inválida o empresa no encontrada.');
        }
        return user;
    }
}
