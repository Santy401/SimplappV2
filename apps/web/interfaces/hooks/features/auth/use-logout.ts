'use client';

import { useState } from 'react';

export const useLogout = () => {
  const [ isLoading, setIsLoading ] = useState(false)

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting logout...');

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      window.location.href = '/ui/pages/Login';

    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/ui/pages/Login';
    } finally {
      setIsLoading(false);
    }
  };
  
  return { handleLogout, isLoading }
};