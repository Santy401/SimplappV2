import { prisma } from '../../lib/prisma';

export class ClientRepository {
    static async findById(id: string, companyId?: string) {
        return prisma.client.findFirst({
            where: { 
                id,
                ...(companyId ? { companyId } : {})
            }
        });
    }

    static async findAll(where: any, skip: number, take: number) {
        return prisma.client.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        });
    }

    static async count(where: any) {
        return prisma.client.count({ where });
    }

    static async create(data: any, txClient?: any) {
        const client = txClient || prisma;
        return client.client.create({ data });
    }

    static async update(id: string, data: any, txClient?: any) {
        const client = txClient || prisma;
        return client.client.update({
            where: { id },
            data
        });
    }

    static async delete(id: string, txClient?: any) {
        const client = txClient || prisma;
        return client.client.delete({
            where: { id }
        });
    }
}
