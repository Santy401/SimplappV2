import { ListPrice } from "@domain/entities/ListPrice.entity";

export const useListPriceFullName = () => {
    const getFullName = (listPrice: ListPrice) => {
        return listPrice.name?.trim() || 'sin nombre';
    };

    return { getFullName };
}