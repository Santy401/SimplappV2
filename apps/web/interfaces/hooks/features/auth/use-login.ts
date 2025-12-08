'use client';

import { apiClient } from '@/interfaces/lib/api-client';
import { LoginCredentials, LoginResponse } from '@/domain/entities/Session.entity';
import { useState } from 'react';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, credentials: LoginCredentials) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al iniciar sesión')
      }

      const data = await response.json()
      console.log('Login successful:', data)

      console.log('Document cookies after login:', document.cookie)

      await new Promise(resolve => setTimeout(resolve, 200))

      console.log('Document cookies after login:', document.cookie)

      await new Promise(resolve => setTimeout(resolve, 200))

      const redirectPath = '/ui/pages/Admin/Index'
      console.log('Redirecting to:', redirectPath)

      window.location.href = redirectPath

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  return {
    email,
    setEmail,
    setPassword,
    password,
    isLoading,
    handleSubmit
  }

};