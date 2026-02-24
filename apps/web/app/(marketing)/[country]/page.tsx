"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@simplapp/ui"
import {
  ArrowRight,
  Kanban,
  List,
  Calendar,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react"

export default function LandingPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = React.use(params)

  return (
    <main className="h-screen overflow-y-auto bg-[#f0f0f5]">
      {/* Contenedor centrado con márgenes amplios */}
      <div className="mx-auto bg-white min-h-full shadow-[0_0_80px_rgba(0,0,0,0.04)]">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="px-10 md:px-16 h-[72px] flex items-center justify-between">
            <Link href={`/${country}`} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-purple-200">
                S
              </div>
              <span className="font-semibold text-lg text-gray-900 tracking-tight">
                Simplapp
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {["Funcionalidades", "Casos de Uso", "Precios", "Blog"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-4"
              >
                <Link href={`/${country}/Login/`}>Iniciar Sesión</Link>
              </Button>
              <Button
                size="sm"
                className="bg-gray-900 text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all"
              >
                <Link href={`/${country}/Register/`}>Empezar Gratis</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="px-10 md:px-16 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              <span className="text-xs font-semibold text-purple-700">
                ✨ Novedad
              </span>
              <span className="text-xs text-gray-600">
                Facturación Electrónica V1.0
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-[56px] md:leading-[1.1] font-extrabold text-gray-900 tracking-tight text-balance">
              Configura cada proceso,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                factura en segundos.
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Gestiona clientes, ventas y facturación electrónica desde una
              única plataforma intuitiva y potente. Tu negocio, bajo control.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col items-center sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-8 h-12 rounded-xl shadow-lg shadow-purple-200 transition-all"
              >
                <Link href={`/${country}/Register/`}>
                  Comenzar Gratis
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 h-12 px-6 rounded-xl"
              >
                Ver demostración
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Chips de funcionalidades */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-12">
            {[
              { icon: Kanban, label: "Gestión de Ventas" },
              { icon: List, label: "Control de Inventario" },
              { icon: Calendar, label: "Vencimientos" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50/60 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer text-gray-600"
              >
                <Icon className="w-4 h-4" />
                <span className="text-[13px] font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Screenshot del app */}
          <div className="mt-14 relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 bg-white">
              <img
                src="/PreviewWeb.png"
                alt="Simplapp Dashboard"
                className="w-full h-auto"
              />
            </div>
            {/* Glow decorativo */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-10 md:px-16 py-20 md:py-28 border-t border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
              Funcionalidades
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Todo lo que tu negocio necesita
            </h2>
            <p className="mt-4 text-gray-500 text-base">
              Herramientas diseñadas para que administres tu empresa sin
              complicaciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Panel de Control Integral",
                desc: "Visualiza el estado de tu negocio en tiempo real con gráficas y métricas precisas.",
                color: "purple",
              },
              {
                icon: Zap,
                title: "Facturación Automatizada",
                desc: "Genera facturas, cotizaciones y remisiones con un solo clic. Cumple con la normativa local.",
                color: "indigo",
              },
              {
                icon: ShieldCheck,
                title: "Gestión de Clientes",
                desc: "Mantén un registro detallado de tus clientes y proveedores para mejorar tus relaciones comerciales.",
                color: "violet",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group p-7 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:shadow-lg hover:shadow-gray-100 hover:border-gray-200 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : color === "indigo"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-violet-100 text-violet-600"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-10 md:px-16 py-20 md:py-28">
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 p-12 md:p-20 text-center relative overflow-hidden">
            {/* Efecto decorativo */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
                ¿Listo para escalar tu negocio?
              </h2>
              <p className="text-base text-gray-400 max-w-lg mx-auto">
                Únete a las empresas que ya simplifican su gestión con
                Simplapp. Sin tarjeta de crédito requerida.
              </p>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-sm font-semibold px-8 h-12 rounded-xl shadow-lg transition-all"
              >
                <Link href={`/${country}/Register/`}>
                  Comenzar Prueba Gratuita
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-100 py-10 px-10 md:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Simplapp
              </span>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Simplapp. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
