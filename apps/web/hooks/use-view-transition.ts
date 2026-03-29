'use client';

import { useCallback } from 'react';

export type ViewTransitionName = 'slide-right' | 'slide-up' | 'fade' | 'none';

interface UseViewTransitionOptions {
  name: ViewTransitionName;
  duration?: number;
}

export function useViewTransition({ name, duration = 300 }: UseViewTransitionOptions) {
  const getViewTransitionStyle = useCallback((elementId?: string) => {
    if (name === 'none') return {};

    const transitionName = elementId ? `shared-${elementId}` : name;
    
    return {
      viewTransitionName: transitionName,
    } as React.CSSProperties;
  }, [name]);

  const getTransitionCss = useCallback((elementId?: string) => {
    if (name === 'none') return '';

    const transitionName = elementId ? `shared-${elementId}` : name;
    return `view-transition-name: ${transitionName};`;
  }, [name]);

  return {
    getViewTransitionStyle,
    getTransitionCss,
    transitionName: name,
    duration,
  };
}

export function getSharedTransitionName(prefix: string, id: string | number): string {
  return `shared-${prefix}-${id}`;
}
