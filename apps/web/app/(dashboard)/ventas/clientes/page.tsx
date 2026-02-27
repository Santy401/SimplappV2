
'use client'; 
import Clientes from '@/app/(dashboard)/Sales/Clients/pages'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
export default function Page() { 
  const { navigateTo } = useNavigation();
  const { setSelectedClient } = useAppState(); 
  return <Clientes onSelect={navigateTo} onSelectClient={setSelectedClient} />; 
}