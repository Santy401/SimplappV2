import { Client } from "./Client.entity";
import { Company } from "./Company.entity";
import { ListPrice } from "./ListPrice.entity";
import { Product } from "./Product.entity";
import { Seller } from "./Seller.entity";
import { Store } from "./Store.entity";
import { User } from "./User.entity";

export enum BillStatus {
    DRAFT = "DRAFT",
    ISSUED = "ISSUED",
    PAID = "PAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    CANCELLED = "CANCELLED",
    TO_PAY = "TO_PAY"
}

export enum PaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    TRANSFER = "TRANSFER",
    CHECK = "CHECK",
    DEPOSIT = "DEPOSIT",
    OTHER = "OTHER",
    CREDIT = "CREDIT"
}

export interface Bill {
    id: string;

    userId: string;
    clientId: string;
    storeId: string;
    listPriceId: string;
    sellerId: string;
    companyId: string;

    prefix?: string | null;
    number: number;
    legalNumber?: string | null;

    status: BillStatus;
    paymentMethod: PaymentMethod;

    date: Date;
    dueDate: Date;

    subtotal: string;
    taxTotal: string;
    discountTotal: string;
    total: string;
    balance: string;

    clientName?: string | null;
    clientIdentification?: string | null;
    clientAddress?: string | null;
    clientPhone?: string | null;
    clientEmail?: string | null;

    notes?: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface BillItem {
    id: string;
    billId: string;
    productId: string;

    quantity: number;
    price: string;

    taxRate: string;
    taxAmount: string;
    discount: string;
    total: string;

    productName?: string | null;
    productCode?: string | null;
}

export interface Payment {
    id: string;
    billId: string;

    amount: string;
    method: PaymentMethod;
    date: Date;
}

// --- Interfaces compuestas (con relaciones) ---

export interface BillWithItems extends Bill {
    items: BillItem[];
    payments?: Payment[]; // Puede tener pagos asociados
}

export interface BillDetail extends BillWithItems {
    client?: Client;
    store?: Store;
    listPrice?: ListPrice;
    seller?: Seller;
    user?: User;
    company?: Company;
    items: (BillItem & { product?: Product })[];
}

// --- Inputs para creación y actualización ---

export interface CreateBillInput {
    userId: string;
    clientId: string;
    storeId: string;
    listPriceId: string;
    sellerId: string;
    companyId: string;

    // Products: CreateBillItemInput[];

    status?: BillStatus;
    paymentMethod?: PaymentMethod;
    subtotal?: string;
    taxTotal?: string;
    discountTotal?: string;
    total?: string;
    balance?: string;

    date?: Date;
    dueDate: Date;

    notes?: string | null;

    items: CreateBillItemInput[];
}

export interface CreateBillItemInput {
    productId: string;
    quantity: number;
    productName?: string;
    productCode?: string;
    price?: string; // Si no se envía se toma del producto
    discount?: string;
    taxRate?: string;
    taxAmount?: string;
    total?: string;
}

export interface CreatePaymentInput {
    billId: string;
    amount: string;
    method: PaymentMethod;
    date?: Date;
}

export interface UpdateBill {
    id: string;
    userId: string;
    clientId: string;
    storeId: string;
    listPriceId?: string;
    sellerId?: string;
    companyId: string;
    prefix?: string | null;
    number?: number;
    legalNumber?: string | null;

    status?: BillStatus;
    paymentMethod?: PaymentMethod;

    date?: Date;
    dueDate?: Date;

    subtotal?: string;
    taxTotal?: string;
    discountTotal?: string;
    total?: string;
    balance?: string;
    items?: (BillItem | CreateBillItemInput)[];

    clientName?: string | null;
    clientIdentification?: string | null;
    clientAddress?: string | null;
    clientPhone?: string | null;
    clientEmail?: string | null;

    notes?: string | null;


    createdAt?: Date;
    updatedAt?: Date;
}