import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class BillRepository {
    static async findById(id: string, companyId?: string) {
        return prisma.bill.findFirst({
            where: { 
                id,
                ...(companyId ? { companyId } : {})
            },
            include: {
                client: true,
                items: true,
                payments: true
            }
        });
    }

    static async findAll(where: any, skip: number, take: number, include?: any) {
        return prisma.bill.findMany({
            where,
            skip,
            take,
            include: include || { client: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async count(where: any) {
        return prisma.bill.count({ where });
    }

    static async findLastBill(companyId: string, prefix?: string) {
        return prisma.bill.findFirst({
            where: { companyId, prefix },
            orderBy: { number: 'desc' }
        });
    }

    static async create(data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.bill.create({ data });
    }

    static async update(id: string, data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.bill.update({
            where: { id },
            data
        });
    }
}
