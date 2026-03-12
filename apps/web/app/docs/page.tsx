"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-slate dark:prose-invert max-w-none"
    >
      <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
        Bienvenido a Simplapp Docs
      </h1>
      <p className="text-xl text-slate-500 mb-12 leading-relaxed">
        Descubre cómo configurar, integrar y sacar el máximo provecho del sistema operativo para negocios modernos.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
            ¿Qué es Simplapp?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Simplapp es una plataforma SaaS diseñada para unificar la gestión de ventas, facturación electrónica (DIAN) e inventarios en un ecosistema centralizado. Nuestro enfoque es proporcionar una experiencia de usuario de nivel Enterprise sin la complejidad típica del software contable tradicional.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Esta documentación está diseñada para guiarte desde tus primeros pasos hasta configuraciones avanzadas multi-tenant y conexiones vía API.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
            Conceptos Core
          </h2>
          <ul className="space-y-4">
            <li className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Multi-Tenant (Empresas)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Un solo usuario puede administrar múltiples empresas o sucursales de forma aislada.
              </p>
            </li>
            <li className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Dashboard Modular</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Las métricas y gráficas son configurables mediante un sistema de drag-and-drop profesional.
              </p>
            </li>
            <li className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Facturación Nativa</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Integración directa con los sistemas fiscales locales (Ej: DIAN en Colombia) para emisión de comprobantes en tiempo real.
              </p>
            </li>
          </ul>
        </section>

        {/* Añadimos espacio extra para demostrar el progress bar del Navbar */}
        <section className="pt-20 pb-40">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">
            Próximos Pasos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Explora la barra lateral para navegar a través de los tutoriales de instalación, configuración de tu primera bodega y emisión de tu primera factura electrónica.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
