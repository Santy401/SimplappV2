
'use client'; 
import ListPrices from '@/app/(dashboard)/Sales/ListPrice/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedListPrice } = useAppState(); 
  return <ListPrices onSelect={navigateTo} onSelectListPrice={setSelectedListPrice} />; 
}