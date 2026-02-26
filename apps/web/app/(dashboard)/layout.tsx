'use client';

import "@/app/globals.css";
import { Sidebar } from "@simplapp/ui";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import { Navbar, GlobalSearch } from "@simplapp/ui";
import { SettingsModal } from "./SettingsModal/SettingsModal";

import dynamic from 'next/dynamic';

import { ProtectedRoute } from "./ProtectedRoute";
import { NavigationProvider, useNavigation } from "@/app/context/NavigationContext";
import { AppStateProvider, useAppState } from "@/app/context/AppStateContext";
import { useSettings } from "@/app/context/SettingsContext";

// ─── Lazy loading de vistas del dashboard ───────────────────────────────────────
// Cada vista se carga solo cuando el usuario navega a ella, reduciendo
// el bundle inicial del dashboard en ~60-70%.
const Dashboard = dynamic(() => import('./Dashboard/page'), { ssr: false });
const Clientes = dynamic(() => import('./Sales/Clients/pages'), { ssr: false });
const CreateClient = dynamic(() => import('./Sales/Clients/create/page'), { ssr: false });
const Vendedores = dynamic(() => import('./Sales/Sellers/page'), { ssr: false });
const CreateSeller = dynamic(() => import('./Sales/Sellers/create/page'), { ssr: false });
const Productos = dynamic(() => import('./Sales/Products/page'), { ssr: false });
const CreateProduct = dynamic(() => import('./Sales/Products/create/page'), { ssr: false });
const Bodega = dynamic(() => import('./Sales/Stores/page'), { ssr: false });
const CreateStore = dynamic(() => import('./Sales/Stores/create/page'), { ssr: false });
const ListPrices = dynamic(() => import('./Sales/ListPrice/page'), { ssr: false });
const CreateListPrice = dynamic(() => import('./Sales/ListPrice/create/page'), { ssr: false });
const Bills = dynamic(() => import('./Sales/Bills/pages'), { ssr: false });
const FormBill = dynamic(() => import('./Sales/Bills/create/page'), { ssr: false });
const ProfileConfig = dynamic(() => import('./Settings/Profile/page'), { ssr: false });

function AdminContent({ children }: { children: React.ReactNode }) {
  const { currentView, navigateTo } = useNavigation();
  const { openSettings } = useSettings();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false); // Mobile sidebar state
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
        return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined}
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
              {renderContent()}
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
              setSelectedClient(item.raw);
              navigateTo('ventas-clientes-view');
            } else if (item.backendType === 'product') {
              setSelectedProduct(item.raw);
              navigateTo('productos-producto-view');
            } else if (item.backendType === 'bill') {
              setSelectedBill(item.raw);
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
