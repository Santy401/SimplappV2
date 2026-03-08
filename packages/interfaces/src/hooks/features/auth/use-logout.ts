'use client';

import { useState } from 'react';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const isProcessDefined = typeof process !== 'undefined' && process.env;
      const rootDomain = isProcessDefined ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined;
      const loginUrl = rootDomain
        ? `https://${rootDomain}/colombia/Login/`
        : '/colombia/Login';
      window.location.href = loginUrl;

    } catch (err) {
      console.error('Logout error:', err);
      const isProcessDefined = typeof process !== 'undefined' && process.env;
      const rootDomain = isProcessDefined ? process.env.NEXT_PUBLIC_ROOT_DOMAIN : undefined;
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