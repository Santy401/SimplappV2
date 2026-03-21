'use client'; 
import Payments from '@/app/(dashboard)/Sales/Payments/page'; 
import { useNavigation } from '@/app/context/NavigationContext'; 

export default function Page() { 
  const { navigateTo } = useNavigation();
  return <Payments onSelect={navigateTo} />; 
}