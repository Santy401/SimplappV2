import type { CreateBillInput, BillDetail } from "@domain/entities/Bill.entity";
import type { Client } from "@domain/entities/Client.entity";
import { Product } from "@domain/entities/Product.entity";
import { Store } from "@domain/entities/Store.entity";
import { Seller } from "@domain/entities/Seller.entity";
import { ListPrice } from "@domain/entities/ListPrice.entity";
export interface FormBillItem {
    id: string;
    productId?: string;
    productName?: string;
    name: string;
    reference: string;
    price: number;
    quantity: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    description: string;
    total: number;
    storeId?: string;
}
interface FormBillProps {
    onSubmit?: (data: CreateBillInput) => void;
    onSaveDraft?: (data: CreateBillInput) => void;
    onEmitBill?: (data: CreateBillInput) => void;
    onSelect?: (view: string) => void;
    onAutoSave?: (data: CreateBillInput) => Promise<string | undefined | null | void>;
    onSelectBill?: (bill: BillDetail) => void;
    initialData?: Partial<BillDetail> & {
        id?: string;
    };
    mode?: "create" | "edit" | "view";
    isLoading?: boolean;
    clients?: Client[];
    products?: Product[];
    stores?: Store[];
    sellers?: Seller[];
    listPrices?: ListPrice[];
    userId?: string;
    storeId?: string;
    companyId: string;
}
export declare function FormBill({ onSubmit, onSaveDraft, onEmitBill, onAutoSave, onSelect, onSelectBill, initialData, mode, isLoading, clients, products, userId, storeId, companyId, stores, sellers, listPrices, }: FormBillProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FormBill.d.ts.map