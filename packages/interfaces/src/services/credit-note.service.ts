import { prisma } from '../../lib/prisma';
import { Prisma, BillStatus as PrismaBillStatus, CreditNoteType as PrismaCreditNoteType } from '../../../../apps/web/prisma/src/generated/prisma';
import { CreditNoteRepository } from '../repositories/credit-note.repository';
import {
    CreateCreditNoteInput,
    CreditNoteStatus,
    CreditNoteType
} from '@domain/entities/CreditNote.entity';
import { BillStatus } from '@domain/entities/Bill.entity';

export class CreditNoteService {
    static async validateCreditNote(input: CreateCreditNoteInput, companyId: string) {
        const bill = await prisma.bill.findUnique({
            where: { id: input.billId },
            include: { items: true }
        });

        if (!bill) {
            throw new Error('Factura no encontrada');
        }

        if (bill.companyId !== companyId) {
            throw new Error('La factura no pertenece a esta empresa');
        }

        if (bill.status === BillStatus.CANCELLED) {
            throw new Error('No se puede crear NC sobre una factura anulada');
        }

        const paymentsCount = await prisma.payment.count({
            where: { billId: input.billId }
        });

        if (paymentsCount > 0) {
            throw new Error('Para crear una nota de crédito primero debes eliminar todos los pagos registrados en esta factura');
        }

        for (const item of input.items) {
            const billItem = bill.items.find((bi: { id: string }) => bi.id === item.billItemId);
            if (!billItem) {
                throw new Error(`Ítem de factura no encontrado: ${item.billItemId}`);
            }

            const existingCreditNotes = await prisma.creditNoteItem.findMany({
                where: { 
                    billItemId: item.billItemId,
                    creditNote: {
                        status: { not: CreditNoteStatus.CANCELLED }
                    }
                },
                include: { creditNote: true }
            });

            const totalReturned = existingCreditNotes
                .filter((cn: { creditNote: { type: PrismaCreditNoteType; }; }) => cn.creditNote.type === PrismaCreditNoteType.RETURN)
                .reduce((sum: number, ci: any) => sum + ci.quantity, 0);

            if (input.type === CreditNoteType.RETURN) {
                if (item.quantity > billItem.quantity - totalReturned) {
                    throw new Error(
                        `Cantidad a devolver excede lo disponible para ${billItem.productName || 'producto'}. ` +
                        `Comprado: ${billItem.quantity}, Ya devuelto: ${totalReturned}, Solicitado: ${item.quantity}`
                    );
                }
            } else {
                if (item.quantity > billItem.quantity) {
                    throw new Error(
                        `La cantidad seleccionada para ${billItem.productName || 'producto'} no puede superar la cantidad original facturada (${billItem.quantity}).`
                    );
                }
            }
        }

        const totalNC = input.items.reduce(
            (sum, item) => sum + Number(item.total || 0),
            0
        );

        const existingTotal = await prisma.creditNote.aggregate({
            where: {
                billId: input.billId,
                status: { in: [CreditNoteStatus.APPLIED, CreditNoteStatus.ISSUED, CreditNoteStatus.DRAFT] }
            },
            _sum: { total: true }
        });

        const totalAlreadyApplied = Number(existingTotal._sum.total || 0);

        if (input.type === CreditNoteType.RETURN) {
            if (totalNC > Number(bill.total) - totalAlreadyApplied) {
                throw new Error(
                    `El total de la nota de crédito excede el saldo disponible de la factura. ` +
                    `Saldo disponible: ${Number(bill.total) - totalAlreadyApplied}`
                );
            }
        }

        return { bill };
    }

    static async create(input: CreateCreditNoteInput, userId: string, companyId: string) {
        await this.validateCreditNote(input, companyId);

        const bill = await prisma.bill.findUnique({
            where: { id: input.billId },
            select: { total: true, appliedCreditNoteTotal: true }
        });

        const lastCreditNote = await prisma.creditNote.findFirst({
            where: { companyId },
            orderBy: { number: 'desc' }
        });
        const nextNumber = (lastCreditNote?.number ?? 0) + 1;

        const subtotal = input.items.reduce(
            (sum, item) => sum + Number(item.subtotal || 0),
            0
        );
        const taxTotal = input.items.reduce(
            (sum, item) => sum + Number(item.taxAmount || 0),
            0
        );
        const discountTotal = input.items.reduce(
            (sum, item) => sum + Number(item.discount || 0),
            0
        );
        const total = input.items.reduce(
            (sum, item) => sum + Number(item.total || 0),
            0
        );

        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const creditNote = await tx.creditNote.create({
                data: {
                    billId: input.billId,
                    userId,
                    companyId,
                    number: nextNumber,
                    status: input.status || CreditNoteStatus.APPLIED,
                    type: input.type,
                    reason: input.reason,
                    date: input.date || new Date(),
                    subtotal: String(subtotal),
                    taxTotal: String(taxTotal),
                    discountTotal: String(discountTotal),
                    total: String(total),
                    notes: input.notes || "",
                    items: {
                        create: input.items.map(item => ({
                            billItemId: item.billItemId,
                            quantity: item.quantity,
                            price: String(item.price || 0),
                            subtotal: String(item.subtotal || 0),
                            taxRate: String(item.taxRate || 0),
                            taxAmount: String(item.taxAmount || 0),
                            discount: String(item.discount || 0),
                            total: String(item.total || 0),
                            productName: item.productName,
                            productCode: item.productCode
                        }))
                    }
                },
                include: {
                    items: true,
                    bill: true
                }
            });

            if (input.type === CreditNoteType.RETURN) {
                for (const item of input.items) {
                    const billItem = await tx.billItem.findUnique({
                        where: { id: item.billItemId },
                        select: { productId: true }
                    });

                    if (billItem) {
                        await tx.product.update({
                            where: { id: billItem.productId },
                            data: { stock: { increment: item.quantity } }
                        });
                    }
                }
            }

            const updatedBill = await tx.bill.update({
                where: { id: input.billId },
                data: { 
                    appliedCreditNoteTotal: { increment: total }
                },
                select: {
                    total: true,
                    appliedCreditNoteTotal: true,
                    paidTotal: true,
                    balance: true,
                    status: true
                }
            });

            const newBalance = updatedBill.total
                .minus(updatedBill.appliedCreditNoteTotal)
                .minus(updatedBill.paidTotal || 0);

            let newStatus: PrismaBillStatus;
            if (newBalance.lte(0)) {
                newStatus = PrismaBillStatus.PAID;
            } else if (updatedBill.appliedCreditNoteTotal.gt(0)) {
                newStatus = PrismaBillStatus.PARTIALLY_PAID;
            } else {
                newStatus = updatedBill.status;
            }

            await tx.bill.update({
                where: { id: input.billId },
                data: { 
                    balance: newBalance,
                    status: newStatus
                }
            });

            return creditNote;
        });
    }

    static async findAll(companyId: string, options: {
        skip?: number;
        take?: number;
        billId?: string;
        status?: CreditNoteStatus;
    }) {
        const { skip = 0, take = 50, billId, status } = options;

        const where: any = { companyId };
        if (billId) where.billId = billId;
        if (status) where.status = status;

        const [data, total] = await Promise.all([
            CreditNoteRepository.findAll(where, skip, take, {
                bill: { include: { client: true } },
                items: true
            }),
            CreditNoteRepository.count(where)
        ]);

        return { data, total };
    }

    static async findById(id: string, companyId: string) {
        return CreditNoteRepository.findById(id, companyId);
    }

    static async cancel(id: string, companyId: string) {
        const creditNote = await prisma.creditNote.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!creditNote) {
            throw new Error('Nota de crédito no encontrada');
        }

        if (creditNote.companyId !== companyId) {
            throw new Error('No autorizado');
        }

        if (creditNote.status !== CreditNoteStatus.DRAFT && creditNote.status !== CreditNoteStatus.APPLIED) {
            throw new Error('Solo se pueden cancelar notas de crédito en estado DRAFT o APPLICADA');
        }

        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            if (creditNote.type === CreditNoteType.RETURN) {
                for (const item of creditNote.items) {
                    await tx.product.update({
                        where: { id: (await tx.billItem.findUnique({
                            where: { id: item.billItemId },
                            select: { productId: true }
                        }))!.productId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
            }

            const bill = await tx.bill.update({
                where: { id: creditNote.billId },
                data: {
                    appliedCreditNoteTotal: {
                        decrement: Number(creditNote.total)
                    }
                },
                select: {
                    total: true,
                    appliedCreditNoteTotal: true,
                    paidTotal: true,
                    balance: true,
                    status: true
                }
            });

            const newBalance = bill.total
                .minus(bill.appliedCreditNoteTotal)
                .minus(bill.paidTotal || 0);

            let newStatus: PrismaBillStatus;
            if (newBalance.lte(0)) {
                newStatus = PrismaBillStatus.PAID;
            } else if (bill.appliedCreditNoteTotal.gt(0)) {
                newStatus = PrismaBillStatus.PARTIALLY_PAID;
            } else {
                newStatus = PrismaBillStatus.TO_PAY;
            }

            await tx.bill.update({
                where: { id: creditNote.billId },
                data: { 
                    balance: newBalance,
                    status: newStatus
                }
            });

            return tx.creditNote.update({
                where: { id },
                data: { status: CreditNoteStatus.CANCELLED }
            });
        });
    }
}
