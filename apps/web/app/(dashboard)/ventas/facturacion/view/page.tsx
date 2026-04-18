
'use client'; 
import FormBill from '@/app/(dashboard)/Sales/Bills/create/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useSearchParams } from 'next/navigation'; 

export default function Page() { 
  const { navigateTo } = useNavigation();
  const searchParams = useSearchParams();
  const billId = searchParams.get('id');
  
  const initialData = billId ? { id: billId } : undefined;
  
  return <FormBill onSelect={navigateTo} onSelectBill={() => {}} initialData={initialData} mode='view' />; 
}