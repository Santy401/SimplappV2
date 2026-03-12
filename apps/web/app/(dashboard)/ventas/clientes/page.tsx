
'use client'; 
import Clientes from '@/app/(dashboard)/Sales/Clients/pages'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
import { Suspense } from 'react';

function ClientesContent() {
  const { navigateTo } = useNavigation();
  const { setSelectedClient } = useAppState(); 
  return <Clientes onSelect={navigateTo} onSelectClient={setSelectedClient} />; 
}

export default function Page() { 
  return (
    <Suspense fallback={<div>Cargando clientes...</div>}>
      <ClientesContent />
    </Suspense>
  );
}