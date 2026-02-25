"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function ResetPassword({
    params,
}: {
    params: Promise<{ country: string }>
}) {
    const { country } = React.use(params)
    const [token, setToken] = useState<string | null>(null)
    const [tokenValid, setTokenValid] = useState<boolean | null>(null) // null = validando
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Leer el token de la URL y validarlo
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const t = params.get("token")
        setToken(t)

        if (!t) {
            setTokenValid(false)
            return
        }

        // Validar token en el servidor antes de mostrar el formulario
        fetch(`/api/auth/reset-password?token=${encodeURIComponent(t)}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setTokenValid(data.valid === true))
            .catch(() => setTokenValid(false))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Error al restablecer la contraseña.")
                return
            }

            setSuccess(true)
        } catch {
            setError("Error de conexión. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength
    const strength = password.length === 0 ? 0
        : password.length < 8 ? 1
            : /[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 12 ? 3
                : 2

    const strengthLabel = ["", "Débil", "Media", "Fuerte"][strength]
    const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-400"][strength]

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f0f5] p-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200 mb-6">
                        S
                    </div>

                    {/* Estados */}
                    {tokenValid === null && (
                        <>
                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin mb-3" />
                            <p className="text-sm text-gray-400">Validando enlace...</p>
                        </>
                    )}

                    {tokenValid === false && (
                        <>
                            <XCircle className="w-10 h-10 text-red-400 mb-3" />
                            <h1 className="text-xl font-bold text-gray-900 mb-1">Enlace inválido</h1>
                            <p className="text-sm text-gray-400 text-center">
                                Este enlace no es válido o ha expirado. Los enlaces tienen una validez de 1 hora.
                            </p>
                            <Link
                                href={`/${country}/ForgotPassword/`}
                                className="mt-6 text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
                            >
                                Solicitar nuevo enlace
                            </Link>
                        </>
                    )}

                    {tokenValid === true && !success && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Nueva contraseña
                            </h1>
                            <p className="text-sm text-gray-400 text-center">
                                Elige una contraseña segura para tu cuenta.
                            </p>
                        </>
                    )}

                    {success && (
                        <>
                            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
                            <h1 className="text-xl font-bold text-gray-900 mb-1">¡Listo!</h1>
                            <p className="text-sm text-gray-400 text-center">
                                Tu contraseña fue actualizada correctamente.
                            </p>
                            <Link
                                href={`/${country}/Login/`}
                                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                Iniciar sesión
                                <ArrowRight size={16} />
                            </Link>
                        </>
                    )}
                </div>

                {/* Formulario */}
                {tokenValid === true && !success && (
                    <>
                        {error && (
                            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nueva contraseña */}
                            <div>
                                <label htmlFor="new-password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Barra de fuerza */}
                                {password.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-100"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${["", "text-red-500", "text-yellow-600", "text-green-600"][strength]}`}>
                                            Contraseña {strengthLabel}
                                            {strength < 3 && " — añade mayúsculas y números para mejorarla"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirmar */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repite tu contraseña"
                                        className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border ${confirmPassword && password !== confirmPassword
                                                ? "border-red-300 focus:border-red-400"
                                                : "border-gray-200 focus:border-purple-300"
                                            } focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all`}
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="mt-1.5 text-xs text-red-500">Las contraseñas no coinciden</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !password || password !== confirmPassword}
                                className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <span>Guardando...</span>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Guardar contraseña</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
