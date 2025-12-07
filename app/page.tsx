"use client"

import Link from "next/link"
import { Button } from "@/app/ui/cn/components/ui/button"
import { ArrowRight, Kanban, List, Calendar } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-border bg-background/80">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl">Simplapp</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Funcionalidades
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Casos de Uso
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Precios
            </Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground transition">
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Link href="/ui/pages/Login">
                Iniciar Sesión
              </Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold">
              ✨ Novedad
            </span>
            <span className="text-sm text-primary">Facturación Electrónica V1.0</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance text-foreground">
              Configura cada proceso, factura en segundos.
            </h1>
            <p className="text-xl text-foreground/60 text-balance max-w-2xl mx-auto">
              Gestiona clientes, ventas y facturación electrónica desde una única plataforma intuitiva y potente. Tu negocio, bajo control.
            </p>
          </div>

          {/* View Options */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition cursor-pointer">
              <Kanban className="w-5 h-5" />
              <span className="text-sm font-medium">Gestión de Ventas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition cursor-pointer">
              <List className="w-5 h-5" />
              <span className="text-sm font-medium">Control de Inventario</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition cursor-pointer">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Vencimientos</span>
            </div>
          </div>
        </div>

        {/* App Screenshot */}
        <div className="mt-16 relative">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-white">
            <img src="/task-management-dashboard-with-kanban-board--team-.jpg" alt="Simplapp Dashboard" className="w-full h-auto" />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          </div>

          {/* Floating card accent */}
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Kanban className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Panel de Control Integral</h3>
            <p className="text-foreground/60">Visualiza el estado de tu negocio en tiempo real con gráficas y métricas precisas.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <List className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Facturación Automatizada</h3>
            <p className="text-foreground/60">Genera facturas, cotizaciones y remisiones con un solo clic. Cumple con la normativa local.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Gestión de Clientes (CRM)</h3>
            <p className="text-foreground/60">Mantén un registro detallado de tus clientes y proveedores para mejorar tus relaciones comerciales.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-border p-12 md:p-20 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">¿Listo para escalar tu negocio?</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            Únete a las empresas que ya simplifican su gestión con Simplapp.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
            Comenzar Prueba Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <p>&copy; 2025 Simplapp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
