import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { BillRepository } from '../repositories/bill.repository';

export class BillService {
    /**
     * Lista facturas con paginación y filtros.
     */
    static async listBills(companyId: string, options: { 
        page?: number, 
        limit?: number, 
        search?: string,
        status?: string
    } = {}) {
        const { page = 1, limit = 10, search, status } = options;
        const skip = (page - 1) * limit;
        
        const where: any = { companyId };
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { number: { contains: search, mode: 'insensitive' } },
                { prefix: { contains: search, mode: 'insensitive' } },
                { client: { firstName: { contains: search, mode: 'insensitive' } } },
                { client: { firstLastName: { contains: search, mode: 'insensitive' } } },
                { client: { commercialName: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [data, total] = await Promise.all([
            BillRepository.findAll(where, skip, limit),
            BillRepository.count(where)
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }

    /**
     * Obtiene el siguiente número de factura correlativo para una compañía.
     */
    static async getNextNumber(companyId: string, prefix?: string) {
        const lastBill = await BillRepository.findLastBill(companyId, prefix);
        return lastBill ? parseInt(lastBill.number) + 1 : 1;
    }

    /**
     * Crea una nueva factura orquestando la lógica de numeración y relación.
     */
    static async createBill(data: any, companyId: string) {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const nextNumber = await this.getNextNumber(companyId, data.prefix);
            
            return BillRepository.create({
                ...data,
                companyId,
                number: String(nextNumber).padStart(6, '0'),
                status: 'DRAFT'
            }, tx);
        });
    }

    /**
     * Cambia el estado de una factura (Emitir, Cancelar, etc.)
     */
    static async updateStatus(billId: string, status: string, companyId: string) {
        const bill = await BillRepository.findById(billId, companyId);
        if (!bill) throw new Error('Factura no encontrada.');
        
        // Lógica de negocio: No se puede cancelar una factura ya pagada (ejemplo)
        if (status === 'CANCELLED' && bill.status === 'PAID') {
            throw new Error('No se puede cancelar una factura que ya ha sido pagada.');
        }

        return BillRepository.update(billId, { status });
    }
}
