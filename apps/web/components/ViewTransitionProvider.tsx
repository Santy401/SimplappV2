'use client';

import { ViewTransitions } from 'next-view-transitions';

interface ViewTransitionProviderProps {
  children: React.ReactNode;
}

export function ViewTransitionProvider({ children }: ViewTransitionProviderProps) {
  return (
    <ViewTransitions>
      {children}
    </ViewTransitions>
  );
}
