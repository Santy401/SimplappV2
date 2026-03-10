"use client"

import React, { useState } from "react"
import { useRegister } from "@interfaces/src/hooks/features/auth/use-register"
import { AuthLayout, AuthForm } from "@simplapp/ui"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export default function RegisterPage({
    params,
}: {
    params: Promise<{ country: string }>
}) {
    const { country } = React.use(params)
    const router = useRouter()
    const { mutate: registerMutation, isPending } = useRegister()
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: ''
        }
    })

    const handleModeChange = (mode: 'login' | 'register') => {
        if (mode === 'login') {
            router.push(`/${country}/Login/`)
        }
    }

    const onSubmit = (data: any) => {
        setError(null)
        if (data.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            return
        }

        registerMutation({
            email: data.email,
            password: data.password,
            name: data.name,
            phone: data.phone,
            acceptTerms: true,
        })
    }

    return (
        <AuthLayout backHref={`/${country}`}>
            <AuthForm 
                mode="register"
                onModeChange={handleModeChange}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                isLoading={isPending}
                error={error}
            />
        </AuthLayout>
    )
}
