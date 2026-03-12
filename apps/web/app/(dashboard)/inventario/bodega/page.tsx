'use client'; 
import Bodega from '@/app/(dashboard)/Sales/Stores/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 
import { useAppState } from '@/app/context/AppStateContext'; 
import { Suspense } from 'react';

const BodegaContent = () => {
  const { navigateTo } = useNavigation();
  const { setSelectedStore } = useAppState(); 
  return <Bodega onSelect={navigateTo} onSelectStores={setSelectedStore} />; 
};

export default function Page() { 
  return (
    <Suspense>
      <BodegaContent />
    </Suspense>
  );
}