import { Store } from "@domain/entities/Store.entity";

export const useStoreFullName = () => {
    const getFullName = (store: Store) => {
        return store.name?.trim() || 'Sin nombre';
    };

    return { getFullName };
}