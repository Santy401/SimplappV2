import { FormBillItem } from "../FormBill/FormBill";
import type { BillStatus, PaymentMethod, DianStatus } from '@domain/entities/Bill.entity';
export interface PaymentPreview {
    id: string;
    date: string | Date;
    receiptNumber?: string | null;
    method: string;
    account?: {
        name: string;
    } | null;
    amount: number | string;
}
export interface BillPreviewProps {
    formData: {
        number?: number;
        date: string;
        dueDate: string;
        clientName: string;
        clientId: string;
        email: string;
        paymentMethod: PaymentMethod;
        status: BillStatus | string;
        notes?: string;
        terms?: string;
        footerNote?: string;
        logo?: string;
        dianStatus?: DianStatus;
        rejectedReason?: string;
        dianResponse?: string;
    };
    items: FormBillItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    total: number;
    payments?: PaymentPreview[];
    onClose: () => void;
}
export declare function BillPreview({ formData, items, subtotal, discountTotal, taxTotal, total, payments, onClose, }: BillPreviewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BillPreview.d.ts.map