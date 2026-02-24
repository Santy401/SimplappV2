import { describe, it, expect } from 'vitest';
import { roundToDecimals, calculateItemTotals, calculateBillTotals } from './billing';

describe('Cálculos Financieros (billing.ts)', () => {

    describe('Redondeo', () => {
        it('redondear a 2 decimales', () => {
            // 10.005 suele redondearse a 10.01 dependiendo de precisión de JS
            expect(roundToDecimals(10.005)).toBe(10.01);
            expect(roundToDecimals(12.344)).toBe(12.34);
            expect(roundToDecimals(12.345)).toBe(12.35);
            expect(roundToDecimals(0.1 + 0.2)).toBe(0.3); // Arregla el 0.30000000000000004
            expect(roundToDecimals(99.999)).toBe(100.00);
        });
    });

    describe('Subtotal y cálculos base', () => {
        it('calcular subtotal correctamente', () => {
            const result = calculateItemTotals({
                price: 1500,
                quantity: 3,
                discountPercentage: 0,
                taxRate: 0
            });
            // 1500 * 3 = 4500
            expect(result.baseSubtotal).toBe(4500);
            expect(result.taxableSubtotal).toBe(4500);
            expect(result.total).toBe(4500);
        });
    });

    describe('Descuentos', () => {
        it('aplicar descuento porcentaje', () => {
            const item = {
                price: 2000,
                quantity: 2, // Subtotal 4000
                discountPercentage: 10, // 10% de 4000 es 400
                taxRate: 0
            };
            const result = calculateItemTotals(item);
            expect(result.discountAmount).toBe(400);
            expect(result.taxableSubtotal).toBe(3600); // 4000 - 400
            expect(result.total).toBe(3600);
        });
    });

    describe('IVA', () => {
        it('calcular IVA 19%', () => {
            const item = {
                price: 1000,
                quantity: 5, // 5000 subtotal base
                discountPercentage: 0,
                taxRate: 19 // 19%
            };
            const result = calculateItemTotals(item);
            expect(result.taxableSubtotal).toBe(5000);

            // 19% de 5000 = 950
            expect(result.taxAmount).toBe(950);
            expect(result.total).toBe(5950);
        });

        it('calcular IVA 5%', () => {
            const item = {
                price: 300,
                quantity: 10, // 3000 subtotal base
                discountPercentage: 0,
                taxRate: 5 // 5%
            };
            const result = calculateItemTotals(item);
            // 5% de 3000 = 150
            expect(result.taxAmount).toBe(150);
            expect(result.total).toBe(3150);
        });

        it('calcular IVA 0%', () => {
            const item = {
                price: 500,
                quantity: 4, // 2000 subtotal
                discountPercentage: 0,
                taxRate: 0 // 0%
            };
            const result = calculateItemTotals(item);
            expect(result.taxAmount).toBe(0);
            expect(result.total).toBe(2000);
        });

        it('calcular IVA habiendo descuentos previamente aplicados', () => {
            const item = {
                price: 1000,
                quantity: 2, // = 2000 subtotal base
                discountPercentage: 50, // 50% desc = 1000 discount
                taxRate: 19 // 19% sobre los 1000 restantes = 190
            };
            const result = calculateItemTotals(item);
            expect(result.discountAmount).toBe(1000);
            expect(result.taxAmount).toBe(190);
            expect(result.total).toBe(1190);
        });
    });

    describe('Total de la factura', () => {
        it('calcular total con múltiples items', () => {
            const item1 = {
                price: 1000,
                quantity: 2, // base subtotal: 2000
                discountPercentage: 10, // desc 200 (taxable: 1800)
                taxRate: 19 // tax: 342 (total: 2142)
            };

            const item2 = {
                price: 500.5,
                quantity: 3, // base subtotal: 1501.5
                discountPercentage: 0, // desc 0 (taxable: 1501.5)
                taxRate: 5 // tax: 75.08 (total: 1576.58)
            };

            const bill = calculateBillTotals([item1, item2]);

            // Comprobando total IVA: 342 + 75.075 -> redondeado a 75.08 -> 417.08
            expect(bill.taxTotal).toBe(417.08);

            // Comprobando descuento: 200 + 0 = 200
            expect(bill.discountTotal).toBe(200);

            // Comprobando subtotal (sin impuestos)
            // item 1 = 1800. item 2 = 1501.5. Suma = 3301.5
            expect(bill.subtotal).toBe(3301.50);

            // Comprobando TOTAL general 
            // 2142 + 1576.58 = 3718.58
            expect(bill.total).toBe(3718.58);
        });

        it('Evitar pérdidas de centavos por coma flotante', () => {
            // 0.1 + 0.2 en JS es 0.30000000000000004
            const result = calculateBillTotals([
                { price: 0.1, quantity: 1, discountPercentage: 0, taxRate: 0 },
                { price: 0.2, quantity: 1, discountPercentage: 0, taxRate: 0 }
            ]);

            expect(result.subtotal).toBe(0.30);
            expect(result.total).toBe(0.30);
        });
    });

});
