"use client"

import { useState } from 'react';
import { Eye, EyeOff, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@simplapp/ui';
import Link from 'next/link';
import { useLogin } from '@hooks/features/auth/use-login';
import { ButtonLoading } from '@ui/atoms/Loading/Loading'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error: formError,
  } = useLogin();

  return (
    <div className="min-h-90 w-full flex items-center justify-center bg-background">
      <Link href="/" className="absolute left-0 top-0 mt-5 ml-5">
        <ArrowLeft className="text-foreground" />
      </Link>

      <div className="w-full max-w-md bg-form-bg rounded-lg scale-86 shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-foreground text-background rounded-lg p-3 mb-6">
            <Zap size={24} />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-3">Iniciar Sesión</h1>
          <p className="text-center text-muted-foreground">
            Ingresa tu correo y contraseña para continuar.
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground-text mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@dominio.com"
              className={`w-full px-4 py-3 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border ${errors.email ? 'border-red-500' : 'border-input'
                } focus:outline-none focus:border-neutral-300 transition`}
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground-text mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-3 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border ${errors.password ? 'border-red-500' : 'border-input'
                  } focus:outline-none focus:border-neutral-300 transition`}
                disabled={isLoading}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-card transition"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground hover:bg-foreground-text-second/70 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition text-background cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span>Iniciando sesión</span>
                <ButtonLoading />
              </>
            ) : (
              'Iniciar Sesión'
            )}
            {!isLoading && <ArrowRight size={18} />}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-foreground-text-second"></div>
          <span className="text-sm text-muted-foreground">O</span>
          <div className="flex-1 h-px bg-foreground-text-second"></div>
        </div>

        <div className="space-y-3">
          <button
            disabled
            className="w-full px-4 py-3 rounded-lg border opacity-15 cursor-no-drop border-neutral-300 bg-white text-foreground-text hover:bg-neutral-50 font-medium flex items-center justify-center gap-2 transition"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" className="inline">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          ¿No tienes una cuenta?{" "}
          <a href="/ui/pages/Register" className="text-blue-400 font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}