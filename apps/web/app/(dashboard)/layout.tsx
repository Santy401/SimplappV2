'use client';

import "@/app/globals.css";
import { Sidebar } from "@simplapp/ui";
import { useEffect } from "react";
import Dashboard from "./Dashboard/page";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import { Navbar, GlobalSearch } from "@simplapp/ui";
import { SettingsModal } from "./SettingsModal/SettingsModal";

import Clientes from "./Sales/Clients/pages";
import CreateClient from "./Sales/Clients/create/page";
import Vendedores from "./Sales/Sellers/page"
import Productos from "./Sales/Products/page";
import CreateProduct from "./Sales/Products/create/page";
import Bodega from "./Sales/Stores/page";
import CreateStore from "./Sales/Stores/create/page";
import CreateSeller from "./Sales/Sellers/create/page";
import ListPrices from "./Sales/ListPrice/page";
import CreateListPrice from "./Sales/ListPrice/create/page";
import Bills from "./Sales/Bills/pages";
import FormBill from "./Sales/Bills/create/page";
import BillsCreatePage from "./Sales/Bills/create/page";
import ProfileConfig from "./Settings/Profile/page";

import { ProtectedRoute } from "./ProtectedRoute";
import { NavigationProvider, useNavigation } from "@/app/context/NavigationContext";
import { AppStateProvider, useAppState } from "@/app/context/AppStateContext";
import { useSettings } from "@/app/context/SettingsContext";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { currentView, navigateTo } = useNavigation();
  const { openSettings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {
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


  const renderContent = () => {
    switch (currentView) {
      case 'inicio':
        return <Dashboard />;
      case 'ventas-venta':
        return <div className="text-white p-8">Comprobante De Venta</div>;
      case 'ventas-cotizaciones':
        return <div className="text-white p-8">Cotizaciones</div>;
      case 'ventas-remisiones':
        return <div className="text-white p-8">Remisiones</div>;

      case 'ventas-facturacion':
        return <Bills onSelect={navigateTo} onSelectBill={setSelectedBill} />;
      case 'ventas-facturacion-create':
        return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined}
          mode={selectedBill ? 'edit' : 'create'} />;
      case 'ventas-facturacion-edit':
        return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined}
          mode={selectedBill ? 'edit' : 'create'} />;
      case 'ventas-facturacion-view':
        return <BillsCreatePage onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined}
          mode={'view'} />;

      case 'ventas-clientes':
        return <Clientes onSelect={navigateTo} onSelectClient={setSelectedClient} />;
      case 'ventas-clientes-create':
        return <CreateClient onBack={() => navigateTo('ventas-clientes')} initialData={selectedClient || undefined}
          mode={selectedClient ? 'edit' : 'create'} />;
      case 'ventas-clientes-edit':
        return <CreateClient onBack={() => navigateTo('ventas-clientes')} initialData={selectedClient || undefined}
          mode={selectedClient ? 'edit' : 'create'} />;

      case 'ventas-productos':
        return <Productos onSelect={navigateTo} onSelectProduct={setSelectedProduct} />;
      case 'ventas-productos-create':
        return <CreateProduct onBack={() => navigateTo('ventas-productos')} initialData={selectedProduct || undefined}
          mode={selectedProduct ? 'edit' : 'create'} />;
      case 'ventas-productos-edit':
        return <CreateProduct onBack={() => navigateTo('ventas-productos')} initialData={selectedProduct || undefined}
          mode={selectedProduct ? 'edit' : 'create'} />;

      case 'ventas-vendedor':
        return <Vendedores onSelect={navigateTo} onSelectSeller={setSelectedSeller} />;
      case 'ventas-vendedor-create':
        return <CreateSeller onBack={() => navigateTo('ventas-vendedor')} initialData={selectedSeller || undefined}
          mode={selectedSeller ? 'edit' : 'create'} />;
      case 'ventas-vendedor-edit':
        return <CreateSeller onBack={() => navigateTo('ventas-vendedor')} initialData={selectedSeller || undefined}
          mode={selectedSeller ? 'edit' : 'create'} />;

      case 'inventario-bodega':
        return <Bodega onSelect={navigateTo} onSelectStores={setSelectedStore} />;
      case 'inventario-bodega-create':
        return <CreateStore onBack={() => navigateTo('inventario-bodega')} initialData={selectedStore || undefined}
          mode={selectedStore ? 'edit' : 'create'} />;
      case 'inventario-bodega-edit':
        return <CreateStore onBack={() => navigateTo('inventario-bodega')} initialData={selectedStore || undefined}
          mode={selectedStore ? 'edit' : 'create'} />;

      case 'inventario-precios':
        return <ListPrices onSelect={navigateTo} onSelectListPrice={setSelectedListPrice} />
      case 'inventario-precios-create':
        return <CreateListPrice onBack={() => navigateTo('inventario-precios')} initialData={selectedListPrice || undefined}
          mode={selectedListPrice ? 'edit' : 'create'} />
      case 'inventario-precios-edit':
        return <CreateListPrice onBack={() => navigateTo('inventario-precios')} initialData={selectedListPrice || undefined}
          mode={selectedListPrice ? 'edit' : 'create'} />

      case 'profile-settings':
        return <ProfileConfig />

      default:
        return <div className="text-white p-8">NO SELECIONADO</div>;
    }
  };

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
      <Sidebar onSelect={handleNavigationList} currentView={currentView} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onSearchOpen={() => setIsSearchOpen(true)} onSelect={handleNavigationList} />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="flex justify-center ml-7 mt-7 mb-7">
            <div className="w-full max-w-[200%] pr-7">
              <Breadcrumb activeItem={currentView} />
              {renderContent()}
              {children}
            </div>
          </div>
        </main>
      </div>
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(id) => navigateTo(id)}
      />
      <SettingsModal />
    </div>
  );
}

import { SettingsProvider } from "@/app/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <NavigationProvider>
        <AppStateProvider>
          <SettingsProvider>
            <AdminContent>{children}</AdminContent>
          </SettingsProvider>
        </AppStateProvider>
      </NavigationProvider>
    </ProtectedRoute>
  );
}
