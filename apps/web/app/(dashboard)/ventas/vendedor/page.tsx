
'use client'; 
import Vendedores from '@/app/(dashboard)/Sales/Sellers/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedSeller } = useAppState(); 
  return <Vendedores onSelect={navigateTo} onSelectSeller={(id) => setSelectedSeller(id)} />; 
}