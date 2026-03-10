"use client"

import React from "react"
import Link from "next/link"
import { LandingHero, LandingBentoGrid, LandingCTA, LandingFooter, SmoothScroll } from "@simplapp/ui"

export default function LandingPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = React.use(params)

  return (
    <SmoothScroll>
      <main className="relative bg-slate-50 selection:bg-purple-200">
        {/* ── Navbar ── */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href={`/${country}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#4318FF] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                S.
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                Simplapp
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Funcionalidades</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Precios</Link>
              <Link href="/docs" className="text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors">Documentación</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link 
                  href={`/${country}/Login`}
                  className="hidden sm:flex text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                  href={`/${country}/Register`}
                  className="h-11 px-6 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center"
              >
                Empezar Gratis
              </Link>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <LandingHero country={country} />
        <div id="features">
          <LandingBentoGrid />
        </div>
        <LandingCTA country={country} />
        <LandingFooter />
      </main>
    </SmoothScroll>
  )
}
