import { Seller } from "@domain/entities/Seller.entity";

export interface SellersProps {
    onSelect?: (view: string) => void;
    onSelectSeller?: (store: Seller) => void;
}