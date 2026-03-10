'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    // Inicialización de Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Función de animación
    function raf(time: number) {
      lenis.raf(time);
      reqRef.current = requestAnimationFrame(raf);
    }

    reqRef.current = requestAnimationFrame(raf);

    // Sincronizar con el scroll del navegador (opcional pero recomendado)
    // window.scrollTo(0, 0);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
