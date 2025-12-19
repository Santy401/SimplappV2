import { ListPrice } from "@domain/entities/ListPrice.entity";

export interface ListPriceProps {
    onSelect?: (view: string) => void;
    onSelectListPrice?: (listPrice: ListPrice) => void;
}