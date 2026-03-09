export type PaymentIncomeType = "CLIENT_INVOICE" | "OTHER";
export interface BankAccount {
    id: string;
    name: string;
}
export interface Client {
    id: string;
    name: string;
}
export interface BillOption {
    id: string;
    number: string | number;
    balance: number;
    clientId: string;
    dueDate?: string;
    total?: number;
}
export interface PaymentBillModalProps {
    receiptNumber?: number;
    companyName?: string;
    bankAccounts?: BankAccount[];
    clients?: Client[];
    bills?: BillOption[];
    onSubmit?: (data: PaymentBillFormData) => void;
    onClose?: () => void;
}
export interface PaymentBillFormData {
    clientId: string;
    bankAccountId: string;
    paymentDate: string;
    paymentMethod: string;
    costCenter: string;
    incomeType: PaymentIncomeType;
    invoicePayments: {
        billId: string;
        amount: number;
    }[];
    notes: string;
}
export declare function PaymentBillModal({ receiptNumber, companyName, bankAccounts, clients, bills, onSubmit, onClose, }: PaymentBillModalProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PaymentBillModal.d.ts.map