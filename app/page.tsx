"use client"

import Link from "next/link"
import { Button } from "@/app/ui/cn/components/ui/button"
import { ArrowRight, Kanban, List, Calendar } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white w-full text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-100 bg-white/80">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">Simplapp</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Funcionalidades
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Casos de Uso
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Precios
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black hover:bg-gray-50">
              <Link href="/ui/pages/Login">
                Iniciar Sesión
              </Link>
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-gray-800 shadow-sm">
              <Link href="/ui/pages/Register">
                Empezar Gratis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-black">
              ✨ Novedad
            </span>
            <span className="text-sm text-gray-600 font-medium">Facturación Electrónica V1.0</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Main Title */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-balance tracking-tight text-gray-900">
              Configura cada proceso, <span className="text-gray-500">factura en segundos.</span>
            </h1>
            <p className="text-xl text-gray-500 text-balance max-w-2xl mx-auto leading-relaxed">
              Gestiona clientes, ventas y facturación electrónica desde una única plataforma intuitiva y potente. Tu negocio, bajo control.
            </p>
          </div>

          {/* View Options */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-8">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow transition cursor-pointer">
              <Kanban className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Gestión de Ventas</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow transition cursor-pointer">
              <List className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Control de Inventario</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow transition cursor-pointer">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Vencimientos</span>
            </div>
          </div>
        </div>

        {/* App Screenshot */}
        <div className="mt-20 relative max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50">
            <img src="/task-management-dashboard-with-kanban-board--team-.jpg" alt="Simplapp Dashboard" className="w-full h-auto" />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
          </div>

          {/* Decorative elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 blur-3xl opacity-50 rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 bg-white">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Kanban className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Panel de Control Integral</h3>
            <p className="text-gray-500 leading-relaxed">Visualiza el estado de tu negocio en tiempo real con gráficas y métricas precisas.</p>
          </div>
          <div className="space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <List className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Facturación Automatizada</h3>
            <p className="text-gray-500 leading-relaxed">Genera facturas, cotizaciones y remisiones con un solo clic. Cumple con la normativa local.</p>
          </div>
          <div className="space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Gestión de Clientes (CRM)</h3>
            <p className="text-gray-500 leading-relaxed">Mantén un registro detallado de tus clientes y proveedores para mejorar tus relaciones comerciales.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-black rounded-3xl p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">¿Listo para escalar tu negocio?</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Únete a las empresas que ya simplifican su gestión con Simplapp.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-8 font-medium">
              Comenzar Prueba Gratuita
            </Button>
          </div>

          {/* Abstract background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute right-0 top-0 w-96 h-96 bg-gray-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-gray-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">Simplapp</span>
          </div>
          <p className="text-gray-500 text-sm">&copy; 2025 Simplapp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
