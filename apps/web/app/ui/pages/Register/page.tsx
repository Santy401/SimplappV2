"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Zap, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from '@simplapp/ui';
import { useRegister } from "@/interfaces/hooks/features/auth/use-register"
import Link from "next/link"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        emailConfirm: '',
        name: '',
        phone: '',
        countryCode: '+57',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptPrivacy: false
    });
    const [error, setError] = useState('');

    const { mutate: register, isPending } = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.email !== formData.emailConfirm) {
            setError('Los emails no coinciden');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.acceptTerms || !formData.acceptPrivacy) {
            setError('Debes aceptar los términos y la política de privacidad');
            return;
        }

        const fullPhone = `${formData.countryCode}${formData.phone}`;

        register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: fullPhone,
            acceptTerms: formData.acceptTerms
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Link href="/">
                <ArrowLeft className="absolute left-0 top-0 mt-5 ml-5" />
            </Link>
            <div className="w-full max-w-md bg-form-bg rounded-lg shadow-sm p-8 max-h-[95vh] scale-91 overflow-y-auto">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-foreground text-background rounded-lg p-3 mb-4">
                        <Zap size={24} />
                    </div>
                    <h1 className="text-3xl font-semibold text-foreground mb-2">Crear Cuenta</h1>
                    <p className="text-center text-muted-foreground">Ingresa tus datos para registrarte.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground-text mb-1">
                            Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground-text mb-1">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@dominio.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="emailConfirm" className="block text-sm font-medium text-foreground-text mb-1">
                                Confirmar Correo <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="emailConfirm"
                                type="email"
                                placeholder="Confirmar correo"
                                value={formData.emailConfirm}
                                onChange={(e) => setFormData({ ...formData, emailConfirm: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground-text mb-1">
                            Número de Teléfono <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="px-2 py-2 rounded-lg bg-form-input-bg text-foreground-text-second border border-input focus:outline-none focus:border-neutral-300"
                                value={formData.countryCode}
                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="flex-1 px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground-text mb-1">
                                Contraseña <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Crear contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground-text mb-1">
                                Confirmar Contraseña <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-form-input-bg text-foreground-text-second placeholder-muted-foreground border border-input focus:outline-none focus:border-neutral-300 transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="acceptTerms" className="text-muted-foreground">
                                Acepto los Términos de Uso
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="acceptPrivacy"
                                checked={formData.acceptPrivacy}
                                onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="acceptPrivacy" className="text-muted-foreground">
                                Acepto la Política de Privacidad
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-foreground text-background hover:bg-white/80 cursor-pointer py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                        disabled={isPending}
                    >
                        {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
                        {!isPending && <ArrowRight size={18} />}
                    </Button>
                </form>

                <p className="text-center text-muted-foreground text-sm mt-6">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/ui/pages/Login" className="text-blue-400 font-medium hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    )
}
