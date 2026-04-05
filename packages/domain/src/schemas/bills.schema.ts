import { z } from 'zod';

const paymentMethodEnum = z.enum([
    'UNDEFINED',
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'TRANSFER',
    'CHECK',
    'DEPOSIT',
    'OTHER',
    'CREDIT'
], {
    message: 'Método de pago inválido'
});

export const billItemSchema = z.object({
    productId: z.string().min(1, 'El producto es requerido'),
    quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
    price: z.number().min(0, 'El precio no puede ser negativo'),
    taxRate: z.number().min(0, 'El impuesto no puede ser negativo').default(0).optional(),
    discount: z.number().min(0, 'El descuento no puede ser negativo').default(0).optional(),
});

export const billsApiSchema = z.object({
    clientId: z.string().min(1, 'El cliente es requerido'),
    storeId: z.string().min(1, 'La tienda es requerida'),
    listPriceId: z.string().optional().nullable(),
    sellerId: z.string().optional().nullable(),
    
    paymentMethod: paymentMethodEnum.default('CASH'),
    
    dueDate: z.coerce.date({
        message: 'Fecha de vencimiento inválida o no proporcionada'
    }).optional(),
    
    notes: z.string().max(1000, 'Las notas no pueden superar los 1000 caracteres').optional().nullable(),
    
    items: z.array(billItemSchema).min(1, 'Debe incluir al menos un producto en la factura'),
});

export type BillsApiInput = z.infer<typeof billsApiSchema>;
export type BillItemInput = z.infer<typeof billItemSchema>;
