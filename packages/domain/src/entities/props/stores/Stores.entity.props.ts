import { Store } from "@domain/entities/Store.entity";

export interface StoresProps {
    onSelect?: (view: string) => void;
    onSelectStores?: (store: Store) => void;
    onDeleteSuccess?: () => void;
}