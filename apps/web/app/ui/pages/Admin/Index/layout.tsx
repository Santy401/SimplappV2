'use client';

import "@/app/globals.css";
import Sidebar from "@/app/ui/components/Navbar/Sidebar";
import { useEffect } from "react";
import Dashboard from "../Dashboard/page";
import React from "react";
import Breadcrumb from "./Breadcrumb";

import Clientes from "@/app/ui/components/Sales/Clients/pages";
import CreateClient from "@/app/ui/components/Sales/Clients/create/page";
import Vendedores from "@/app/ui/components/Sales/Sellers/page"
import Productos from "@/app/ui/components/Sales/Products/page";
import CreateProduct from "@/app/ui/components/Sales/Products/create/page";
import Bodega from "@/app/ui/components/Sales/Stores/page";
import CreateStore from "@/app/ui/components/Sales/Stores/create/page";
import CreateSeller from "@/app/ui/components/Sales/Sellers/create/page";
import ListPrices from "@/app/ui/components/Sales/ListPrice/page";
import CreateListPrice from "@/app/ui/components/Sales/ListPrice/create/page";
import Bills from "@/app/ui/components/Sales/Bills/pages";
import FormBill from "@/app/ui/components/Sales/Bills/create/page";
import BillsCreatePage from "@/app/ui/components/Sales/Bills/create/page";

import { ProtectedRoute } from "@/app/ui/components/ProtectedRoute";
import { SessionProvider } from "@/app/context/SessionContext";
import { NavigationProvider, useNavigation } from "@/app/context/NavigationContext";
import { AppStateProvider, useAppState } from "@/app/context/AppStateContext";
import { LoadingProvider } from "@/app/context/LoadingContext";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { currentView, navigateTo } = useNavigation();
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

  console.log('📋 Layout - selectedBill:', selectedBill);
  console.log('📋 Layout - currentView:', currentView);

  const renderContent = () => {
    switch (currentView) {
      case 'inicio':
        return <div className="text-white">Inicio</div>;
      case 'dashboard':
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
      default:
        return <div className="text-white p-8">NO SELECIONADO</div>;
    }
  };

  return (
    <div className="flex w-full">
      <Sidebar onSelect={navigateTo} />

      <main className="flex-1 flex justify-center ml-7 mt-7">
        <div className="w-full max-w-[200%]">
          <Breadcrumb activeItem={currentView} />
          {renderContent()}
          {children}
        </div>
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <ProtectedRoute>
          <NavigationProvider>
            <AppStateProvider>
              <AdminContent>{children}</AdminContent>
            </AppStateProvider>
          </NavigationProvider>
        </ProtectedRoute>
      </LoadingProvider>
    </SessionProvider>
  );
}