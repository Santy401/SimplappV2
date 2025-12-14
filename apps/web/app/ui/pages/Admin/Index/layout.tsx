'use client';

import "@/app/globals.css";
import Sidebar from "@/app/ui/components/Navbar/Sidebar";
import { useState } from "react";
import Dashboard from "../Dashboard/page";
import React from "react";
import Breadcrumb from "./Breadcrumb";

import Clientes from "@/app/ui/components/Ventas/Clientes/pages";
import CreateClient from "@/app/ui/components/Ventas/Clientes/create/page";
import Vendedores from "@/app/ui/components/Ventas/Vendedor/page"
import Productos from "@/app/ui/components/Ventas/Productos/page";
import Bodega  from "@/app/ui/components/Ventas/Bodega/page";
import CreateStore from "@/app/ui/components/Ventas/Bodega/create/page";

import { Client } from "@domain/entities/Client.entity";
import { Store } from "@domain/entities/Store.entity";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentView, setCurrentView] = useState('inicio');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

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
      case 'ventas-productos':
        return <Productos />;
      case 'ventas-vendedor':
        return <Vendedores />;
      case 'ventas-bodega':
        return <Bodega onSelect={setCurrentView} onSelectStores={setSelectedStore} />;
      case 'ventas-bodega-create':
        return <CreateStore onBack={() => setCurrentView('ventas-bodega')} initialData={selectedStore || undefined} 
         mode={selectedStore ? 'edit' : 'create'} />;
      default:
        return <div className="text-white p-8">Selecciona una opción del menú</div>;
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