"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@simplapp/ui"
import Link from "next/link"
import React from "react"
import { useLogin } from "@hooks/features/auth/use-login"
import { ButtonLoading } from "@ui/atoms/Loading/Loading"

export default function Login({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = React.use(params)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error: formError,
  } = useLogin()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f5] p-4">
      {/* Back link */}
      <Link
        href={`/${country}`}
        className="fixed top-6 left-6 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </Link>

      {/* Card principal */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-10">
        {/* Logo + Título */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200 mb-6">
            S
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-gray-400">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@dominio.com"
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border ${errors.email
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-purple-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all`}
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border ${errors.password
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-purple-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all pr-11`}
                disabled={isLoading}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span>Iniciando sesión</span>
                <ButtonLoading />
              </>
            ) : (
              "Iniciar Sesión"
            )}
            {!isLoading && <ArrowRight size={16} />}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400">o continúa con</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* Google */}
        <button
          disabled
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all opacity-40 cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
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

        {/* Footer link */}
        <p className="text-center text-sm text-gray-400 mt-7">
          ¿No tienes una cuenta?{" "}
          <Link
            href={`/${country}/Register/`}
            className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}