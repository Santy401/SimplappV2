import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export function SubscriptionSettings() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Planes y  Suscripción</h3>
                <p className="text-sm text-slate-500 mt-1">
                    Administra tu plan actual, métodos de pago y descarga tus facturas de Simplapp.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Activo
                    </span>
                </div>

                <h4 className="text-sm font-medium text-slate-500 mb-2">Plan Actual</h4>
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">Free</span>
                    <span className="text-slate-500">Early Access</span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-lg">
                    Actualmente estás disfrutando de todos los beneficios de Simplapp gratuitamente por ser usuario pionero. Pronto habilitaremos la integración de pagos para planes Pro y Enterprise con Wompi / Stripe.
                </p>

                <div className="flex gap-4">
                    <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg font-medium cursor-not-allowed">
                        Elegir Plan Pro
                    </button>
                    <button className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        Ver beneficios
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white">Métodos de pago</h4>
                <div className="p-4 border border-sidebar-border border-dashed rounded-xl flex flex-col items-center justify-center text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <CreditCard className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No hay tarjetas asociadas</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">Próximamente podrás agregar tus tarjetas de crédito y débito de forma segura.</p>
                </div>
            </div>
        </div>
    );
}
