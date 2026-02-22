"use client";

import { useState } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Button, Input } from "@simplapp/ui";
import { Receipt, Save } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@interfaces/lib/api-client";

export function BillingSettings() {
    const { user, refetch } = useSession();

    // Facturación
    const [currency, setCurrency] = useState(user?.currency || "COP");
    const [invoicePrefix, setInvoicePrefix] = useState(user?.invoicePrefix || "FAC");
    const [invoiceInitialNumber, setInvoiceInitialNumber] = useState(user?.invoiceInitialNumber || 1);
    const [defaultTax, setDefaultTax] = useState(user?.defaultTax || "19");

    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const hasChanges =
        currency !== (user?.currency || "COP") ||
        invoicePrefix !== (user?.invoicePrefix || "FAC") ||
        String(invoiceInitialNumber) !== String(user?.invoiceInitialNumber || 1) ||
        defaultTax !== (user?.defaultTax || "19");

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.put("/api/auth/profile", {
                name: user.name,
                language: user.language,
                timezone: user.timezone,
                country: user.country,
                profileLogo: user.profileLogo,
                companyLogo: user.companyLogo,
                legalName: user.legalName,
                businessType: user.businessType,
                industry: user.industry,
                companyName: user.companyName,
                taxIdentification: user.taxIdentification,
                taxRegime: user.taxRegime,
                taxResponsibilities: user.taxResponsibilities,
                state: user.state,
                city: user.city,
                address: user.address,
                zipCode: user.zipCode,
                phone: user.phone,
                billingEmail: user.billingEmail,
                website: user.website,

                // Current updates
                currency, invoicePrefix, invoiceInitialNumber: Number(invoiceInitialNumber), defaultTax,
            });
            toast.success("Facturación actualizada con éxito");
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar facturación");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl pb-10">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Facturación y DIAN</h2>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Moneda Base</label>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="COP">COP ($)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Impuesto por Defecto (%)</label>
                        <Input value={defaultTax} onChange={e => setDefaultTax(e.target.value)} type="number" className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Numeración</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prefijo de Factura</label>
                        <Input value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50 uppercase" placeholder="FAC" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Siguiente Consecutivo</label>
                        <Input value={invoiceInitialNumber} onChange={e => setInvoiceInitialNumber(Number(e.target.value))} type="number" min="1" className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                    <div className="col-span-full bg-purple-500/10 text-purple-600 dark:text-purple-400 p-4 rounded-xl border border-purple-500/20 text-sm mt-2 flex items-center gap-3">
                        <Receipt className="w-5 h-5" />
                        <span>Tu próxima factura será generada como: <strong>{invoicePrefix}-{invoiceInitialNumber}</strong></span>
                    </div>
                </div>
            </div>

            {hasChanges && (
                <div className="flex justify-end pt-2 pb-8">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 px-6 py-2">
                        {isSaving ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                    </Button>
                </div>
            )}
        </div>
    );
}
