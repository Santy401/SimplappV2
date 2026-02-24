/**
 * Funciones puras para los cálculos financieros de la aplicación.
 * 
 * Es CRÍTICO que estos cálculos sean precisos para evitar pérdidas.
 * Se manejan en céntimos o con números redondeados a 2 decimales para precisión de punto flotante.
 */

export interface CalculateItemParams {
    price: number;
    quantity: number;
    discountPercentage: number;
    taxRate: number;
}

export interface ItemCalculationResult {
    baseSubtotal: number;
    discountAmount: number;
    taxableSubtotal: number;
    taxAmount: number;
    total: number;
}

/**
 * Redondea un número a una cantidad específica de decimales (por defecto 2).
 * Ideal para representar moneda (COP, USD).
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
    const multiplier = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

/**
 * Calcula los totales para un solo ítem aplicando el descuento y luego el impuesto al remanente.
 */
export const calculateItemTotals = (item: CalculateItemParams): ItemCalculationResult => {
    const baseSubtotal = roundToDecimals(item.price * item.quantity);

    // El descuento aplica sobre el subtotal base (antes de impuestos)
    const discountAmount = roundToDecimals(baseSubtotal * (item.discountPercentage / 100));

    // El valor base sometido a impuestos es el subtotal tras el descuento
    const taxableSubtotal = roundToDecimals(baseSubtotal - discountAmount);

    // El IVA (impuesto) se calcula sobre el valor final base (menos descuentos)
    const taxAmount = roundToDecimals(taxableSubtotal * (item.taxRate / 100));

    const total = roundToDecimals(taxableSubtotal + taxAmount);

    return {
        baseSubtotal,
        discountAmount,
        taxableSubtotal,
        taxAmount,
        total
    };
};

/**
 * Recibe una lista de ítems e iterando usa calculateItemTotals para hallar los totales de la factura.
 */
export const calculateBillTotals = (items: CalculateItemParams[]) => {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;
    let total = 0;

    for (const item of items) {
        const itemResult = calculateItemTotals(item);

        // Subtotal de la factura es siempre sumar todos los subtotales luego de descuento
        // o el subtotal base. Normalmente el Subtotal de la factura es el valor antes de impuestos,
        // se puede interpretar de dos maneras. Utilicemos la misma que `FormBill` emplea:
        // FormBill.tsx -> subtotal = sum(itemSubtotal - discountAmount)
        subtotal += itemResult.taxableSubtotal;

        taxTotal += itemResult.taxAmount;
        discountTotal += itemResult.discountAmount;
        total += itemResult.total;
    }

    return {
        subtotal: roundToDecimals(subtotal),
        taxTotal: roundToDecimals(taxTotal),
        discountTotal: roundToDecimals(discountTotal),
        total: roundToDecimals(total),
    };
};
