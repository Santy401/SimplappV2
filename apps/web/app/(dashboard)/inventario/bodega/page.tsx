
'use client'; 
import Bodega from '@/app/(dashboard)/Sales/Stores/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedStore } = useAppState(); 
  return <Bodega onSelect={navigateTo} onSelectStores={setSelectedStore} />; 
}