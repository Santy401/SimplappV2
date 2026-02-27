"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function ForgotPassword({
    params,
}: {
    params: Promise<{ country: string }>
}) {
    const { country } = React.use(params)
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.trim(), country }),
            })

            // Siempre mostramos el estado de "enviado" — anti-enumeration
            setSent(true)
        } catch {
            setError("Error de conexión. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f5] p-4">
            {/* Back link */}
            <Link
                href={`/${country}/Login/`}
                className="fixed top-6 left-6 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al login</span>
            </Link>

            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-10">
                {/* Logo + Título */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200 mb-6">
                        S
                    </div>
                    {!sent ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                ¿Olvidaste tu contraseña?
                            </h1>
                            <p className="text-sm text-gray-400 text-center">
                                Ingresa tu correo y te enviaremos un enlace para restablecerla.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Revisa tu correo
                            </h1>
                            <p className="text-sm text-gray-400 text-center">
                                Si ese correo está registrado, recibirás el enlace en los próximos minutos.
                            </p>
                        </>
                    )}
                </div>

                {/* Estado enviado */}
                {sent ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Enviamos un enlace a <strong className="text-gray-900">{email}</strong>.
                            El enlace expira en 1 hora.
                        </p>
                        <p className="text-xs text-gray-400 text-center">
                            ¿No lo recibiste? Revisa tu carpeta de spam o{" "}
                            <button
                                onClick={() => { setSent(false); setEmail("") }}
                                className="text-purple-600 hover:text-purple-700 underline"
                            >
                                intenta de nuevo
                            </button>
                        </p>
                        <Link
                            href={`/${country}/Login/`}
                            className="mt-2 text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Error */}
                        {error && (
                            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="forgot-email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="correo@dominio.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email.trim()}
                                className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <span>Enviando...</span>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar enlace</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-400 mt-6">
                            ¿Recordaste tu contraseña?{" "}
                            <Link
                                href={`/${country}/Login/`}
                                className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
