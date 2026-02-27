
'use client'; 
import FormBill from '@/app/(dashboard)/Sales/Bills/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedBill, selectedBill } = useAppState(); 
  return <FormBill onSelect={navigateTo} onSelectBill={setSelectedBill} initialData={selectedBill || undefined} mode={selectedBill ? 'edit' : 'create'} />; 
}