import { Seller } from "@domain/entities/Seller.entity";

export interface SellersProps {
    onSelect?: (view: string) => void;
    onSelectSeller?: (product: Seller) => void;
    onDeleteSuccess?: () => void;
}