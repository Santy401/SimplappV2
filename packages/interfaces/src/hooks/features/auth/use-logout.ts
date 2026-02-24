'use client';

import { useState } from 'react';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting logout...');

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Redirigir al login en el dominio público
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
      const loginUrl = rootDomain
        ? `https://${rootDomain}/colombia/Login/`
        : '/colombia/Login';
      window.location.href = loginUrl;

    } catch (err) {
      console.error('Logout error:', err);
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
      const loginUrl = rootDomain
        ? `https://${rootDomain}/colombia/Login/`
        : '/colombia/Login';
      window.location.href = loginUrl;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading }
};