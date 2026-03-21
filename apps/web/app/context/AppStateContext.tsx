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
    setSelectedClient: (client: Client | string | null) => void;
    setSelectedSeller: (seller: Seller | string | null) => void;
    setSelectedStore: (store: Store | string | null) => void;
    setSelectedProduct: (product: Product | string | null) => void;
    setSelectedListPrice: (listPrice: any | string | null) => void;
    setSelectedBill: (bill: Bill | string | null) => void;
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
    const [selectedClient, _setSelectedClient] = usePersistedState<Client | null>(
        "app_selected_client",
        null
    );

    const [selectedSeller, _setSelectedSeller] = usePersistedState<Seller | null>(
        "app_selected_seller",
        null
    );

    const [selectedStore, _setSelectedStore] = usePersistedState<Store | null>(
        "app_selected_store",
        null
    );

    const [selectedProduct, _setSelectedProduct] = usePersistedState<Product | null>(
        "app_selected_product",
        null
    );

    const [selectedListPrice, _setSelectedListPrice] = usePersistedState<any | null>(
        "app_selected_listprice",
        null
    );

    const [selectedBill, _setSelectedBill] = usePersistedState<Bill | null>(
        "app_selected_bill",
        null
    );

    const setSelectedClient = (client: Client | string | null) => {
        if (typeof client === 'string') {
            _setSelectedClient({ id: client } as any);
        } else {
            _setSelectedClient(client);
        }
    };

    const setSelectedSeller = (seller: Seller | string | null) => {
        if (typeof seller === 'string') {
            _setSelectedSeller({ id: seller } as any);
        } else {
            _setSelectedSeller(seller);
        }
    };

    const setSelectedStore = (store: Store | string | null) => {
        if (typeof store === 'string') {
            _setSelectedStore({ id: store } as any);
        } else {
            _setSelectedStore(store);
        }
    };

    const setSelectedProduct = (product: Product | string | null) => {
        if (typeof product === 'string') {
            _setSelectedProduct({ id: product } as any);
        } else {
            _setSelectedProduct(product);
        }
    };

    const setSelectedListPrice = (listPrice: any | string | null) => {
        if (typeof listPrice === 'string') {
            _setSelectedListPrice({ id: listPrice } as any);
        } else {
            _setSelectedListPrice(listPrice);
        }
    };

    const setSelectedBill = (bill: Bill | string | null) => {
        if (typeof bill === 'string') {
            _setSelectedBill({ id: bill } as any);
        } else {
            _setSelectedBill(bill);
        }
    };

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
