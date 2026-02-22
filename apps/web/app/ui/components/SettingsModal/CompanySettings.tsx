"use client";

import { useState } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Button, Input } from "@simplapp/ui";
import { UploadCloud, Save } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@interfaces/lib/api-client";

export function CompanySettings() {
    const { user, refetch } = useSession();

    // Empresa
    const [companyLogo, setCompanyLogo] = useState(user?.companyLogo || "");
    const [legalName, setLegalName] = useState(user?.legalName || "");
    const [businessType, setBusinessType] = useState(user?.businessType || "");
    const [industry, setIndustry] = useState(user?.industry || "");

    // Información fiscal
    const [taxIdentification, setTaxIdentification] = useState(user?.taxIdentification || "");
    const [taxRegime, setTaxRegime] = useState(user?.taxRegime || "");
    const [taxResponsibilities, setTaxResponsibilities] = useState(user?.taxResponsibilities || "");

    // Dirección fiscal
    const [country, setCountry] = useState(user?.country || "Colombia");
    const [stateRegion, setStateRegion] = useState(user?.state || "");
    const [city, setCity] = useState(user?.city || "");
    const [address, setAddress] = useState(user?.address || "");
    const [zipCode, setZipCode] = useState(user?.zipCode || "");

    // Contacto
    const [billingEmail, setBillingEmail] = useState(user?.billingEmail || "");
    const [website, setWebsite] = useState(user?.website || "");

    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const hasChanges =
        companyLogo !== (user?.companyLogo || "") ||
        legalName !== (user?.legalName || "") ||
        businessType !== (user?.businessType || "") ||
        industry !== (user?.industry || "") ||
        taxIdentification !== (user?.taxIdentification || "") ||
        taxRegime !== (user?.taxRegime || "") ||
        taxResponsibilities !== (user?.taxResponsibilities || "") ||
        country !== (user?.country || "Colombia") ||
        stateRegion !== (user?.state || "") ||
        city !== (user?.city || "") ||
        address !== (user?.address || "") ||
        zipCode !== (user?.zipCode || "") ||
        billingEmail !== (user?.billingEmail || "") ||
        website !== (user?.website || "");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCompanyLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.put("/api/auth/profile", {
                name: user.name,
                language: user.language,
                timezone: user.timezone,
                profileLogo: user.profileLogo,
                phone: user.phone,
                currency: user.currency,
                invoicePrefix: user.invoicePrefix,
                invoiceInitialNumber: user.invoiceInitialNumber,
                defaultTax: user.defaultTax,
                companyName: user.companyName,

                // Current updates
                companyLogo, legalName, businessType, industry,
                taxIdentification, taxRegime, taxResponsibilities,
                country, state: stateRegion, city, address, zipCode,
                billingEmail, website
            });
            toast.success("Empresa actualizada con éxito");
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar empresa");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl pb-10">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Información de la Organización</h2>

                <div className="mb-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center gap-6">
                    <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800">
                        {companyLogo ? <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" /> : <UploadCloud className="text-slate-400 opacity-50 w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-1">Logo de la empresa</h3>
                        <p className="text-xs text-slate-500 mb-2">Usado en facturas y documentos.</p>
                        <label className="text-xs font-semibold text-purple-600 hover:text-purple-500 cursor-pointer uppercase tracking-wide">
                            Subir nueva imagen
                            <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Razón Social</label>
                        <Input value={legalName} onChange={e => setLegalName(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. Simplapp Tech S.A.S" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre Comercial</label>
                        <Input value={user.companyName || ""} disabled title="Manejado en perfil principal" className="bg-slate-50 dark:bg-slate-900/50 opacity-60" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de Negocio</label>
                        <select value={businessType} onChange={e => setBusinessType(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="">Selecciona...</option>
                            <option value="startup">Startup</option>
                            <option value="agency">Agencia</option>
                            <option value="freelance">Independiente</option>
                            <option value="retail">Retail / Tienda</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sector/Industria</label>
                        <Input value={industry} onChange={e => setIndustry(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. Tecnología, Software, Belleza" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Información Fiscal (DIAN)</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">NIT</label>
                        <Input value={taxIdentification} onChange={e => setTaxIdentification(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. 901234567-8" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Régimen</label>
                        <select value={taxRegime} onChange={e => setTaxRegime(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="">Selecciona...</option>
                            <option value="Común">Régimen Común</option>
                            <option value="Simplificado">Régimen Simplificado</option>
                            <option value="Simple">Régimen Simple de Tributación</option>
                        </select>
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Responsabilidades</label>
                        <Input value={taxResponsibilities} onChange={e => setTaxResponsibilities(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. O-13 Gran Contribuyente" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Dirección Fiscal</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">País</label>
                        <select value={country} onChange={e => setCountry(e.target.value)} className="w-full h-10 px-3 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                            <option value="Colombia">🇨🇴 Colombia</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Departamento</label>
                        <Input value={stateRegion} onChange={e => setStateRegion(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ciudad</label>
                        <Input value={city} onChange={e => setCity(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Código Postal</label>
                        <Input value={zipCode} onChange={e => setZipCode(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. 110111" />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dirección Exacta</label>
                        <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="Ej. Calle 123 # 45-67 Piso 2" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contacto</h3>
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Recepcionista</label>
                        <Input value={billingEmail} onChange={e => setBillingEmail(e.target.value)} type="email" className="bg-slate-50 dark:bg-slate-900/50" placeholder="facturacion@empresa.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sitio Web</label>
                        <Input value={website} onChange={e => setWebsite(e.target.value)} className="bg-slate-50 dark:bg-slate-900/50" placeholder="https://miempresa.com" />
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
