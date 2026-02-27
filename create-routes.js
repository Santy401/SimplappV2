const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'apps/web/app/(dashboard)');

const routes = [
  { p: 'dashboard', content: `export { default } from "@/app/(dashboard)/Dashboard/page";` },
  { p: 'ventas/venta', content: `export default function Venta() { return <div className="text-white p-8">Comprobante De Venta</div>; }` },
  { p: 'ventas/cotizaciones', content: `export default function Cotizaciones() { return <div className="text-white p-8">Cotizaciones</div>; }` },
  { p: 'ventas/remisiones', content: `export default function Remisiones() { return <div className="text-white p-8">Remisiones</div>; }` },

  {
    p: 'ventas/facturacion', content: `
'use client'; 
import Bills from '@/app/(dashboard)/Sales/Bills/pages'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill } = useAppState(); 
  return <Bills onSelect={navigateTo} onSelectBill={setSelectedBill} />; 
}` },
  {
    p: 'ventas/facturacion/create', content: `
'use client'; 
import FormBill from '@/app/(dashboard)/Sales/Bills/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill, selectedBill } = useAppState(); 
  return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined} mode={selectedBill ? 'edit' : 'create'} />; 
}` },
  {
    p: 'ventas/facturacion/edit', content: `
'use client'; 
import FormBill from '@/app/(dashboard)/Sales/Bills/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill, selectedBill } = useAppState(); 
  return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined} mode={selectedBill ? 'edit' : 'create'} />; 
}` },
  {
    p: 'ventas/facturacion/view', content: `
'use client'; 
import FormBill from '@/app/(dashboard)/Sales/Bills/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill, selectedBill } = useAppState(); 
  return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined} mode='view' />; 
}` },

  // Clientes
  {
    p: 'ventas/clientes', content: `
'use client'; 
import Clientes from '@/app/(dashboard)/Sales/Clients/pages'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedClient } = useAppState(); 
  return <Clientes onSelect={navigateTo} onSelectClient={setSelectedClient} />; 
}` },
  {
    p: 'ventas/clientes/create', content: `
'use client'; 
import CreateClient from '@/app/(dashboard)/Sales/Clients/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedClient, selectedClient } = useAppState(); 
  return <CreateClient onBack={() => navigateTo('ventas-clientes')} initialData={selectedClient || undefined} mode={selectedClient ? 'edit' : 'create'} />; 
}` },
  {
    p: 'ventas/clientes/edit', content: `
'use client'; 
import CreateClient from '@/app/(dashboard)/Sales/Clients/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedClient, selectedClient } = useAppState(); 
  return <CreateClient onBack={() => navigateTo('ventas-clientes')} initialData={selectedClient || undefined} mode={selectedClient ? 'edit' : 'create'} />; 
}` },

  // Productos
  {
    p: 'ventas/productos', content: `
'use client'; 
import Productos from '@/app/(dashboard)/Sales/Products/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedProduct } = useAppState(); 
  return <Productos onSelect={navigateTo} onSelectProduct={setSelectedProduct} />; 
}` },
  {
    p: 'ventas/productos/create', content: `
'use client'; 
import CreateProduct from '@/app/(dashboard)/Sales/Products/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedProduct, selectedProduct } = useAppState(); 
  return <CreateProduct onBack={() => navigateTo('ventas-productos')} initialData={selectedProduct || undefined} mode={selectedProduct ? 'edit' : 'create'} />; 
}` },
  {
    p: 'ventas/productos/edit', content: `
'use client'; 
import CreateProduct from '@/app/(dashboard)/Sales/Products/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedProduct, selectedProduct } = useAppState(); 
  return <CreateProduct onBack={() => navigateTo('ventas-productos')} initialData={selectedProduct || undefined} mode={selectedProduct ? 'edit' : 'create'} />; 
}` },

  // Vendedor
  {
    p: 'ventas/vendedor', content: `
'use client'; 
import Vendedores from '@/app/(dashboard)/Sales/Sellers/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedSeller } = useAppState(); 
  return <Vendedores onSelect={navigateTo} onSelectSeller={setSelectedSeller} />; 
}` },
  {
    p: 'ventas/vendedor/create', content: `
'use client'; 
import CreateSeller from '@/app/(dashboard)/Sales/Sellers/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedSeller, selectedSeller } = useAppState(); 
  return <CreateSeller onBack={() => navigateTo('ventas-vendedor')} initialData={selectedSeller || undefined} mode={selectedSeller ? 'edit' : 'create'} />; 
}` },
  {
    p: 'ventas/vendedor/edit', content: `
'use client'; 
import CreateSeller from '@/app/(dashboard)/Sales/Sellers/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedSeller, selectedSeller } = useAppState(); 
  return <CreateSeller onBack={() => navigateTo('ventas-vendedor')} initialData={selectedSeller || undefined} mode={selectedSeller ? 'edit' : 'create'} />; 
}` },

  // Bodega
  {
    p: 'inventario/bodega', content: `
'use client'; 
import Bodega from '@/app/(dashboard)/Sales/Stores/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedStore } = useAppState(); 
  return <Bodega onSelect={navigateTo} onSelectStores={setSelectedStore} />; 
}` },
  {
    p: 'inventario/bodega/create', content: `
'use client'; 
import CreateStore from '@/app/(dashboard)/Sales/Stores/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedStore, selectedStore } = useAppState(); 
  return <CreateStore onBack={() => navigateTo('inventario-bodega')} initialData={selectedStore || undefined} mode={selectedStore ? 'edit' : 'create'} />; 
}` },
  {
    p: 'inventario/bodega/edit', content: `
'use client'; 
import CreateStore from '@/app/(dashboard)/Sales/Stores/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedStore, selectedStore } = useAppState(); 
  return <CreateStore onBack={() => navigateTo('inventario-bodega')} initialData={selectedStore || undefined} mode={selectedStore ? 'edit' : 'create'} />; 
}` },

  // Precios
  {
    p: 'inventario/precios', content: `
'use client'; 
import ListPrices from '@/app/(dashboard)/Sales/ListPrice/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedListPrice } = useAppState(); 
  return <ListPrices onSelect={navigateTo} onSelectListPrice={setSelectedListPrice} />; 
}` },
  {
    p: 'inventario/precios/create', content: `
'use client'; 
import CreateListPrice from '@/app/(dashboard)/Sales/ListPrice/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedListPrice, selectedListPrice } = useAppState(); 
  return <CreateListPrice onBack={() => navigateTo('inventario-precios')} initialData={selectedListPrice || undefined} mode={selectedListPrice ? 'edit' : 'create'} />; 
}` },
  {
    p: 'inventario/precios/edit', content: `
'use client'; 
import CreateListPrice from '@/app/(dashboard)/Sales/ListPrice/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedListPrice, selectedListPrice } = useAppState(); 
  return <CreateListPrice onBack={() => navigateTo('inventario-precios')} initialData={selectedListPrice || undefined} mode={selectedListPrice ? 'edit' : 'create'} />; 
}` },

  // Settings
  {
    p: 'profile-settings', content: `
'use client';
import ProfileConfig from '@/app/(dashboard)/Settings/Profile/page';
export default function Page() {
  return <ProfileConfig />;
}` }
];

routes.forEach(r => {
  const dirPath = path.join(rootDir, r.p);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  fs.writeFileSync(filePath, r.content);
  console.log('Created ' + filePath);
});
