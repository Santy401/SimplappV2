'use client';

import "@/app/globals.css";
import { Sidebar } from "@simplapp/ui";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import { Navbar, GlobalSearch } from "@simplapp/ui";
import { SettingsModal } from "./SettingsModal/SettingsModal";

import { ProtectedRoute } from "./ProtectedRoute";
import { NavigationProvider, useNavigation } from "@/app/context/NavigationContext";
import { AppStateProvider, useAppState } from "@/app/context/AppStateContext";
import { useSettings } from "@/app/context/SettingsContext";

// ─── Rutas migradas a App Router de Next.js (`/dashboard`, `/ventas/facturacion`, etc.) ───

function AdminContent({ children }: { children: React.ReactNode }) {
  const { currentView, navigateTo } = useNavigation();
  const { openSettings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false); // Mobile sidebar state
  const {
    selectedClient: _selectedClient,
    selectedSeller: _selectedSeller,
    selectedStore: _selectedStore,
    selectedProduct: _selectedProduct,
    selectedListPrice: _selectedListPrice,
    selectedBill: _selectedBill,
    setSelectedClient,
    setSelectedSeller: _setSelectedSeller,
    setSelectedStore: _setSelectedStore,
    setSelectedProduct,
    setSelectedListPrice: _setSelectedListPrice,
    setSelectedBill,
  } = useAppState();

  useEffect(() => {
    if (currentView === 'ventas-productos') {
      setSelectedProduct(null);
    }
  }, [currentView, setSelectedProduct]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  // Las vistas del Dashboard se cargan ahora usando App Router en `children`

  const handleNavigationList = (id: string) => {
    if (id === 'settings' || id === 'perfil-usuario' || id === 'profile-settings') {
      openSettings('perfil');
      return;
    }
    if (id === 'facturacion') {
      openSettings('facturacion');
      return;
    }
    navigateTo(id);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar
        onSelect={(id) => {
          handleNavigationList(id);
          setIsMobileMenuOpen(false); // Close mobile sidebar on select
        }}
        currentView={currentView}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onSearchOpen={() => setIsSearchOpen(true)}
          onSelect={handleNavigationList}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="flex justify-center ml-7 mt-7 mb-7">
            <div className="w-full pr-7">
              <Breadcrumb activeItem={currentView} />
              {children}
            </div>
          </div>
        </main>
      </div>
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(id, item) => {
          if (item?.backendType && item.raw) {
            if (item.backendType === 'client') {
              setSelectedClient(item.raw as any);
              navigateTo('ventas-clientes-view');
            } else if (item.backendType === 'product') {
              setSelectedProduct(item.raw as any);
              navigateTo('productos-producto-view');
            } else if (item.backendType === 'bill') {
              setSelectedBill(item.raw as any);
              navigateTo('ventas-facturacion-view');
            } else {
              navigateTo(id);
            }
          } else {
            navigateTo(id);
          }
        }}
      />
      <SettingsModal />
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <NavigationProvider>
        <AppStateProvider>
          <AdminContent>{children}</AdminContent>
        </AppStateProvider>
      </NavigationProvider>
    </ProtectedRoute>
  );
}
