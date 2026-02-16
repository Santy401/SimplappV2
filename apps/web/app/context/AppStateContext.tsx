"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePersistedState } from "@hooks/usePersistedState";
import { Client } from "@domain/entities/Client.entity";
import { Seller } from "@domain/entities/Seller.entity";
import { Store } from "@domain/entities/Store.entity";
import { Product } from "@domain/entities/Product.entity";
import { Bill } from "@domain/entities/Bill.entity";

interface AppState {
    selectedClient: Client | null;
    selectedSeller: Seller | null;
    selectedStore: Store | null;
    selectedProduct: Product | null;
    selectedListPrice: any | null;
    selectedBill: Bill | null;
}

interface AppStateContextType extends AppState {
    setSelectedClient: (client: Client | null) => void;
    setSelectedSeller: (seller: Seller | null) => void;
    setSelectedStore: (store: Store | null) => void;
    setSelectedProduct: (product: Product | null) => void;
    setSelectedListPrice: (listPrice: any | null) => void;
    setSelectedBill: (bill: Bill | null) => void;
    clearAllSelections: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppState must be used within AppStateProvider");
    }
    return context;
};

interface AppStateProviderProps {
    children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
    const [selectedClient, setSelectedClient] = usePersistedState<Client | null>(
        "app_selected_client",
        null
    );

    const [selectedSeller, setSelectedSeller] = usePersistedState<Seller | null>(
        "app_selected_seller",
        null
    );

    const [selectedStore, setSelectedStore] = usePersistedState<Store | null>(
        "app_selected_store",
        null
    );

    const [selectedProduct, setSelectedProduct] = usePersistedState<Product | null>(
        "app_selected_product",
        null
    );

    const [selectedListPrice, setSelectedListPrice] = usePersistedState<any | null>(
        "app_selected_listprice",
        null
    );

    const [selectedBill, setSelectedBill] = usePersistedState<Bill | null>(
        "app_selected_bill",
        null
    );

    const clearAllSelections = () => {
        setSelectedClient(null);
        setSelectedSeller(null);
        setSelectedStore(null);
        setSelectedProduct(null);
        setSelectedListPrice(null);
        setSelectedBill(null);
    };

    return (
        <AppStateContext.Provider
            value={{
                selectedClient,
                selectedSeller,
                selectedStore,
                selectedProduct,
                selectedListPrice,
                selectedBill,
                setSelectedClient,
                setSelectedSeller,
                setSelectedStore,
                setSelectedProduct,
                setSelectedListPrice,
                setSelectedBill,
                clearAllSelections,
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
};
