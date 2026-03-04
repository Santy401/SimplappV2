
'use client';
import CreateStore from '@/app/(dashboard)/Sales/Stores/create/page';
import { useNavigation } from '@/app/context/NavigationContext';
import { useAppState } from '@/app/context/AppStateContext';
export default function Page() {
  const { navigateTo } = useNavigation();
  const { setSelectedStore: _setSelectedStore, selectedStore } = useAppState();
  return <CreateStore onBack={() => navigateTo('inventario-bodega')} initialData={selectedStore || undefined} mode={selectedStore ? 'edit' : 'create'} />;
}