
'use client'; 
import CreateProduct from '@/app/(dashboard)/Sales/Products/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedProduct, selectedProduct } = useAppState(); 
  return <CreateProduct onBack={() => navigateTo('ventas-productos')} initialData={selectedProduct || undefined} mode={selectedProduct ? 'edit' : 'create'} />; 
}