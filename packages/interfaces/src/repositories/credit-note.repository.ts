import { Prisma } from '../../../../apps/web/prisma/src/generated/prisma';
import { prisma } from '../../lib/prisma';

export class CreditNoteRepository {
    static async findById(id: string, companyId?: string) {
        return prisma.creditNote.findFirst({
            where: {
                id,
                ...(companyId ? { companyId } : {})
            },
            include: {
                bill: {
                    include: {
                        items: true
                    }
                },
                items: true
            }
        });
    }

    static async findAll(where: any, skip: number, take: number, include?: any) {
        return prisma.creditNote.findMany({
            where,
            skip,
            take,
            include: include || { bill: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async count(where: any) {
        return prisma.creditNote.count({ where });
    }

    static async findLastCreditNote(companyId: string, prefix?: string) {
        return prisma.creditNote.findFirst({
            where: { companyId, prefix },
            orderBy: { number: 'desc' }
        });
    }

    static async findByBillId(billId: string) {
        return prisma.creditNote.findMany({
            where: { billId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async create(data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.creditNote.create({ data });
    }

    static async update(id: string, data: any, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.creditNote.update({
            where: { id },
            data
        });
    }

    static async delete(id: string, txClient?: Prisma.TransactionClient) {
        const client = txClient || prisma;
        return client.creditNote.delete({
            where: { id }
        });
    }
}
