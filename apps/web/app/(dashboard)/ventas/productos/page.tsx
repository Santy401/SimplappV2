
'use client'; 
import Productos from '@/app/(dashboard)/Sales/Products/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedProduct } = useAppState(); 
  return <Productos onSelect={navigateTo} onSelectProduct={setSelectedProduct} />; 
}