
'use client'; 
import CreateListPrice from '@/app/(dashboard)/Sales/ListPrice/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedListPrice, selectedListPrice } = useAppState(); 
  return <CreateListPrice onBack={() => navigateTo('inventario-precios')} initialData={selectedListPrice || undefined} mode={selectedListPrice ? 'edit' : 'create'} />; 
}