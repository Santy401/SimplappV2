"use client"

import React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@simplapp/ui"
import { useRegister } from "@interfaces/src/hooks/features/auth/use-register"
import Link from "next/link"

export default function Register({
    params,
}: {
    params: Promise<{ country: string }>
}) {
    const { country } = React.use(params)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        emailConfirm: "",
        name: "",
        phone: "",
        countryCode: "+57",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        acceptPrivacy: false,
    })
    const [error, setError] = useState("")

    const { mutate: register, isPending } = useRegister()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.email !== formData.emailConfirm) {
            setError("Los emails no coinciden")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        if (!formData.acceptTerms || !formData.acceptPrivacy) {
            setError("Debes aceptar los términos y la política de privacidad")
            return
        }

        const fullPhone = `${formData.countryCode}${formData.phone}`

        register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: fullPhone,
            acceptTerms: formData.acceptTerms,
        })
    }

    const inputClass =
        "w-full px-4 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-sm placeholder-gray-400 border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"

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
            <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-10 max-h-[92vh] overflow-y-auto">
                {/* Logo + Título */}
                <div className="flex flex-col items-center mb-7">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-200 mb-5">
                        S
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Crear tu cuenta
                    </h1>
                    <p className="text-sm text-gray-400">
                        Completa tus datos para comenzar
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-[13px] font-medium text-gray-700 mb-1.5"
                        >
                            Nombre Completo{" "}
                            <span className="text-red-400 text-xs">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Emails */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[13px] font-medium text-gray-700 mb-1.5"
                            >
                                Correo Electrónico{" "}
                                <span className="text-red-400 text-xs">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@dominio.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="emailConfirm"
                                className="block text-[13px] font-medium text-gray-700 mb-1.5"
                            >
                                Confirmar Correo{" "}
                                <span className="text-red-400 text-xs">*</span>
                            </label>
                            <input
                                id="emailConfirm"
                                type="email"
                                placeholder="Confirmar correo"
                                value={formData.emailConfirm}
                                onChange={(e) =>
                                    setFormData({ ...formData, emailConfirm: e.target.value })
                                }
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-[13px] font-medium text-gray-700 mb-1.5"
                        >
                            Número de Teléfono{" "}
                            <span className="text-red-400 text-xs">*</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2.5 rounded-xl bg-gray-50 text-gray-900 text-sm border border-gray-200 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                value={formData.countryCode}
                                onChange={(e) =>
                                    setFormData({ ...formData, countryCode: e.target.value })
                                }
                            >
                                <option value="+57">🇨🇴 +57</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+52">🇲🇽 +52</option>
                                <option value="+34">🇪🇸 +34</option>
                            </select>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="300 123 4567"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                                className={`flex-1 ${inputClass}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[13px] font-medium text-gray-700 mb-1.5"
                            >
                                Contraseña{" "}
                                <span className="text-red-400 text-xs">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Crear contraseña"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className={`${inputClass} pr-11`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-[13px] font-medium text-gray-700 mb-1.5"
                            >
                                Confirmar Contraseña{" "}
                                <span className="text-red-400 text-xs">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2.5 pt-1">
                        <label
                            htmlFor="acceptTerms"
                            className="flex items-start gap-2.5 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={(e) =>
                                    setFormData({ ...formData, acceptTerms: e.target.checked })
                                }
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-200"
                            />
                            <span className="text-[13px] text-gray-500 group-hover:text-gray-700 transition-colors">
                                Acepto los{" "}
                                <Link href="#" className="text-purple-600 hover:underline">
                                    Términos de Uso
                                </Link>
                            </span>
                        </label>
                        <label
                            htmlFor="acceptPrivacy"
                            className="flex items-start gap-2.5 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                id="acceptPrivacy"
                                checked={formData.acceptPrivacy}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        acceptPrivacy: e.target.checked,
                                    })
                                }
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-200"
                            />
                            <span className="text-[13px] text-gray-500 group-hover:text-gray-700 transition-colors">
                                Acepto la{" "}
                                <Link href="#" className="text-purple-600 hover:underline">
                                    Política de Privacidad
                                </Link>
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer mt-2"
                        disabled={isPending}
                    >
                        {isPending ? "Creando cuenta..." : "Crear Cuenta"}
                        {!isPending && <ArrowRight size={16} />}
                    </Button>
                </form>

                {/* Footer link */}
                <p className="text-center text-sm text-gray-400 mt-7">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href={`/${country}/Login/`}
                        className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    )
}
