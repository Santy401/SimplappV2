
'use client'; 
import Bills from '@/app/(dashboard)/Sales/Bills/pages'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill } = useAppState(); 
  return <Bills onSelect={navigateTo} onSelectBill={setSelectedBill} />; 
}