"use client"

import React from "react"
import { useLogin } from "@hooks/features/auth/use-login"
import { AuthLayout, AuthForm } from "@simplapp/ui"
import { useRouter } from "next/navigation"

export default function LoginPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = React.use(params)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    error: formError,
  } = useLogin()

  const handleModeChange = (mode: 'login' | 'register') => {
    if (mode === 'register') {
      router.push(`/${country}/Register/`)
    }
  }

  return (
    <AuthLayout backHref={`/${country}`}>
      <AuthForm 
        mode="login"
        onModeChange={handleModeChange}
        onSubmit={handleSubmit}
        register={register}
        formErrors={errors}
        isLoading={isLoading}
        error={formError}
      />
    </AuthLayout>
  )
}
