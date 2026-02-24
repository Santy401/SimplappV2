"use client";

import { useState } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Button, Input } from "@simplapp/ui";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@interfaces/lib/api-client";

export function ProfileSettings() {
    const { user, refetch } = useSession();

    const [name, setName] = useState(user?.name || "");
    const [language, setLanguage] = useState(user?.language || "es");
    const [timezone, setTimezone] = useState(user?.timezone || "America/Bogota");
    const [profileLogo, setProfileLogo] = useState(user?.profileLogo || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const hasChanges =
        name !== (user?.name || "") ||
        language !== (user?.language || "es") ||
        timezone !== (user?.timezone || "America/Bogota") ||
        profileLogo !== (user?.profileLogo || "") ||
        phone !== (user?.phone || "");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.put("/api/auth/profile", {
                name, language, timezone, profileLogo, phone,
                country: user.country,
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
                currency: user.currency,
                invoicePrefix: user.invoicePrefix,
                invoiceInitialNumber: user.invoiceInitialNumber,
                defaultTax: user.defaultTax,
                billingEmail: user.billingEmail,
                website: user.website,
            });
            toast.success("Perfil actualizado con éxito");
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl pb-10">
            <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Mi Perfil</h2>
                <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    {profileLogo ? (
                        <img src={profileLogo} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center text-3xl font-bold shadow-sm border border-purple-500/20">
                            {name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-semibold mb-1">{name}</h3>
                        <p className="text-slate-500 text-sm">{user.email}</p>
                        <label className="text-xs font-semibold text-purple-600 hover:text-purple-500 cursor-pointer mt-3 inline-block uppercase tracking-wide">
                            Cambiar foto
                            <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre y Apellido</label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center justify-between">
                            Dirección de Email <Lock className="w-3 h-3 text-slate-400" />
                        </label>
                        <Input value={user.email} disabled className="bg-slate-50 dark:bg-slate-900/50 opacity-60" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Teléfono de Perfil</label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Preferencias</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Idioma Principal</label>
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Zona Horaria</label>
                        <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="America/Bogota">Bogotá (GMT-5)</option>
                            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                        </select>
                    </div>
                </div>
            </div>

            {hasChanges && (
                <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 px-6 py-2">
                        {isSaving ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                    </Button>
                </div>
            )}
        </div>
    );
}
