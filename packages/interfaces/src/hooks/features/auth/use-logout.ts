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

      window.location.href = '/colombia/Login';

    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/colombia/Login';
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading }
};