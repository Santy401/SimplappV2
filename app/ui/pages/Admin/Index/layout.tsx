'use client';

import "@/app/globals.css";
import Sidebar from "@/app/ui/components/Navbar/Sidebar";
import { useState } from "react";
import Dashboard from "../Dashboard/page";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import Clientes from "@/app/ui/components/Ventas/Clientes/pages";
import { CreateClient } from "@/app/ui/components/Ventas/Clientes/create/page";
import { Client } from "@/domain/entities/Client.entity";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentView, setCurrentView] = useState('inicio');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const renderContent = () => {
    switch (currentView) {
      case 'inicio':
        return <div className="text-white">Eres el mejor brother :D!</div>;
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
        return <div className="text-white p-8">Productos De Venta</div>;
      case 'vendedores':
        return <div>Vendedores</div>;
      default:
        return <div className="text-white p-8">Selecciona una opción del menú</div>;
    }
  };

  return (
    <html suppressHydrationWarning>
      <body>
        <Sidebar onSelect={setCurrentView} />
        <div className="w-full ml-7 mt-7">
          {children}
          <Breadcrumb activeItem={currentView} />
          {renderContent()}
        </div>
      </body>
    </html>
  );
}