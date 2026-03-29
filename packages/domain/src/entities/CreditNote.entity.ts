export enum CreditNoteStatus {
    DRAFT = "DRAFT",
    ISSUED = "ISSUED",
    APPLIED = "APPLIED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}

export enum CreditNoteType {
    RETURN = "RETURN",
    DISCOUNT = "DISCOUNT",
    PRICE_ADJUSTMENT = "PRICE_ADJUSTMENT"
}

export enum CreditNoteReason {
    DEVOLUCION_PARCIAL = "DEVOLUCION_PARCIAL",
    DEVOLUCION_TOTAL = "DEVOLUCION_TOTAL",
    ANULACION = "ANULACION",
    DESCUENTO_COMERCIAL = "DESCUENTO_COMERCIAL",
    DESCUENTO_CONDICIONAL = "DESCUENTO_CONDICIONAL",
    OTRO = "OTRO"
}

export const DIAN_REASON_CODES: Record<CreditNoteReason, string> = {
    [CreditNoteReason.DEVOLUCION_PARCIAL]: "01",
    [CreditNoteReason.DEVOLUCION_TOTAL]: "02",
    [CreditNoteReason.ANULACION]: "03",
    [CreditNoteReason.DESCUENTO_COMERCIAL]: "04",
    [CreditNoteReason.DESCUENTO_CONDICIONAL]: "05",
    [CreditNoteReason.OTRO]: "06"
};

export interface CreditNote {
    id: string;

    billId: string;
    userId: string;
    companyId: string;

    prefix?: string | null;
    number: number;
    legalNumber?: string | null;

    status: CreditNoteStatus;
    type: CreditNoteType;
    reason: CreditNoteReason;

    date: Date;

    subtotal: string;
    taxTotal: string;
    discountTotal: string;
    total: string;

    notes?: string | null;

    cufe?: string | null;
    dianStatus?: string | null;
    xml?: string | null;
    pdfUrl?: string | null;
    dianResponse?: string | null;
    sentAt?: Date | null;
    acceptedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreditNoteItem {
    id: string;
    creditNoteId: string;
    billItemId: string;

    quantity: number;
    price: string;
    subtotal: string;

    taxRate: string;
    taxAmount: string;
    discount: string;
    total: string;

    productName?: string | null;
    productCode?: string | null;
}

export interface CreditNoteWithItems extends CreditNote {
    items: CreditNoteItem[];
}

export interface CreateCreditNoteInput {
    billId: string;

    status?: CreditNoteStatus;
    type: CreditNoteType;
    reason: CreditNoteReason;

    date?: Date;

    notes?: string | null;

    items: CreateCreditNoteItemInput[];
}

export interface CreateCreditNoteItemInput {
    billItemId: string;
    quantity: number;
    price?: string;
    subtotal?: string;
    taxRate?: string;
    taxAmount?: string;
    discount?: string;
    total?: string;
    productName?: string;
    productCode?: string;
}

export interface UpdateCreditNote {
    id: string;

    status?: CreditNoteStatus;
    reason?: CreditNoteReason;
    notes?: string | null;

    items?: (CreditNoteItem | CreateCreditNoteItemInput)[];
}
