
'use client'; 
import CreateSeller from '@/app/(dashboard)/Sales/Sellers/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedSeller, selectedSeller } = useAppState(); 
  return <CreateSeller onBack={() => navigateTo('ventas-vendedor')} initialData={selectedSeller || undefined} mode={selectedSeller ? 'edit' : 'create'} />; 
}