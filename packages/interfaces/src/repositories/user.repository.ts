import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { User } from '@simplapp/domain';

export class UserRepository {
    /**
     * Busca un usuario por su email.
     */
    static async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                companies: {
                    include: {
                        company: true
                    }
                }
            }
        });
    }

    /**
     * Busca un usuario por su ID, incluyendo su empresa actual.
     */
    static async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                companies: {
                    include: {
                        company: true
                    }
                }
            }
        });
    }

    /**
     * Crea un usuario básico con una transacción orquestada desde el servicio.
     */
    static async create(data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.user.create({
            data,
            include: {
                companies: {
                    include: {
                        company: true
                    }
                }
            }
        });
    }

    /**
     * Actualiza datos de perfil o sesión del usuario.
     */
    static async update(id: string, data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.user.update({
            where: { id },
            data
        });
    }
}
