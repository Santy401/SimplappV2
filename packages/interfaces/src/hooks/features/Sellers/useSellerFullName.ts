import { Seller } from "@domain/entities/Seller.entity";

export const useSellerFullName = (seller?: Seller) => {
    const getFullName = (Seller: Seller) => {
        return Seller.name?.trim() || 'sin nombre';
    }
}