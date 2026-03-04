
'use client';
import CreateClient from '@/app/(dashboard)/Sales/Clients/create/page';
import { useNavigation } from '@/app/context/NavigationContext';
import { useAppState } from '@/app/context/AppStateContext';
export default function Page() {
  const { navigateTo } = useNavigation();
  const { setSelectedClient: _setSelectedClient, selectedClient } = useAppState();
  return <CreateClient onBack={() => navigateTo('ventas-clientes')} initialData={selectedClient || undefined} mode={selectedClient ? 'edit' : 'create'} />;
}