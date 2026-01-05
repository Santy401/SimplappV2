'use client';

import "@/app/globals.css";
import Sidebar from "@/app/ui/components/Navbar/Sidebar";
import { useEffect, useState } from "react";
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

import { Client } from "@domain/entities/Client.entity";
import { Store } from "@domain/entities/Store.entity";
import { Product } from "@domain/entities/Product.entity";
import CreateSeller from "@/app/ui/components/Sales/Sellers/create/page";
import { Seller } from "@domain/entities/Seller.entity";
import ListPrices from "@/app/ui/components/Sales/ListPrice/page";
import CreateListPrice from "@/app/ui/components/Sales/ListPrice/create/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentView, setCurrentView] = useState('inicio');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedListPrice, setSelectedListPrice] = useState<Store | null>(null);

  useEffect(() => {
    if (currentView === 'ventas-productos') {
      setSelectedProduct(null);
    }
  }, [currentView]);

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

      case 'ventas-clientes':
        return <Clientes onSelect={setCurrentView} onSelectClient={setSelectedClient} />;
      case 'ventas-clientes-create':
        return <CreateClient onBack={() => setCurrentView('ventas-clientes')} initialData={selectedClient || undefined}
          mode={selectedClient ? 'edit' : 'create'} />;
      case 'ventas-clientes-edit':
        return <CreateClient onBack={() => setCurrentView('ventas-clientes')} initialData={selectedClient || undefined}
          mode={selectedClient ? 'edit' : 'create'} />;

      case 'ventas-productos':
        return <Productos onSelect={setCurrentView} onSelectProduct={setSelectedProduct} />;
      case 'ventas-productos-create':
        return <CreateProduct onBack={() => setCurrentView('ventas-productos')} initialData={selectedProduct || undefined}
          mode={selectedProduct ? 'edit' : 'create'} />;
      case 'ventas-productos-edit':
        return <CreateProduct onBack={() => setCurrentView('ventas-productos')} initialData={selectedProduct || undefined}
          mode={selectedProduct ? 'edit' : 'create'} />;

      case 'ventas-vendedor':
        return <Vendedores onSelect={setCurrentView} onSelectSeller={setSelectedSeller} />;
      case 'ventas-vendedor-create':
        return <CreateSeller onBack={() => setCurrentView('ventas-vendedor')} initialData={selectedSeller || undefined}
          mode={selectedSeller ? 'edit' : 'create'} />;
      case 'ventas-vendedor-edit':
        return <CreateSeller onBack={() => setCurrentView('ventas-vendedor')} initialData={selectedSeller || undefined}
          mode={selectedSeller ? 'edit' : 'create'} />;

      case 'ventas-bodega':
        return <Bodega onSelect={setCurrentView} onSelectStores={setSelectedStore} />;
      case 'ventas-bodega-create':
        return <CreateStore onBack={() => setCurrentView('ventas-bodega')} initialData={selectedStore || undefined}
          mode={selectedStore ? 'edit' : 'create'} />;
      case 'ventas-bodega-edit':
        return <CreateStore onBack={() => setCurrentView('ventas-bodega')} initialData={selectedStore || undefined}
          mode={selectedStore ? 'edit' : 'create'} />;

      case 'inventario-precios':
        return <ListPrices onSelect={setCurrentView} onSelectListPrice={setSelectedListPrice} />
      case 'inventario-precios-create':
        return <CreateListPrice onBack={() => setCurrentView('inventario-precios')} initialData={selectedListPrice || undefined}
          mode={selectedListPrice ? 'edit' : 'create'} />
      case 'inventario-precios-edit':
        return <CreateListPrice onBack={() => setCurrentView('inventario-precios')} initialData={selectedListPrice || undefined}
          mode={selectedListPrice ? 'edit' : 'create'} />
      default:
        return <div className="text-white p-8">NO SELECIONADO</div>;
    }
  };

  return (
    <div className="flex w-full">
      <Sidebar onSelect={setCurrentView} />

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