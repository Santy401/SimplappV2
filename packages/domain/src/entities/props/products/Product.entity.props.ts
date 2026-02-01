import { Product } from "@domain/entities/Product.entity";

export interface ProductsProps {
    onSelect?: (view: string) => void;
    onSelectProduct?: (product: Product) => void;
    onDeleteSuccess?: () => void;
}