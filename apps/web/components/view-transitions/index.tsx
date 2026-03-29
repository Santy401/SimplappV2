'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface PageViewTransitionProps {
  children: React.ReactNode;
  type?: 'slide-right' | 'slide-up' | 'fade';
}

export function PageViewTransition({ children, type = 'fade' }: PageViewTransitionProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousPathname.current !== pathname && mainRef.current) {
      mainRef.current.classList.remove('vt-enter');
      void mainRef.current.offsetWidth;
      mainRef.current.classList.add('vt-enter');
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return (
    <main
      ref={mainRef}
      className={`vt-page vt-${type}`}
      style={{ viewTransitionName: 'page-content' }}
    >
      {children}
    </main>
  );
}

interface SharedElementProps {
  children: React.ReactNode;
  name: string;
  className?: string;
}

export function SharedElement({ children, name, className = '' }: SharedElementProps) {
  return (
    <div className={className} style={{ viewTransitionName: name }}>
      {children}
    </div>
  );
}
