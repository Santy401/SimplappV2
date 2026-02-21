"use client";

import { useState } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Button, Input } from "@simplapp/ui";
import {
    UserCircle2, Building2, Shield, Gem, UploadCloud,
    FileText, MapPin, Receipt, Phone, Lock, Save
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@interfaces/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
    { id: "user", label: "Usuario", icon: UserCircle2 },
    { id: "company", label: "Empresa", icon: Building2 },
    { id: "fiscal", label: "Fiscal", icon: FileText },
    { id: "address", label: "Dirección", icon: MapPin },
    { id: "billing", label: "Facturación", icon: Receipt },
    { id: "contact", label: "Contacto", icon: Phone },
];

export default function ProfileConfig() {
    const { user, refetch } = useSession();
    const [activeTab, setActiveTab] = useState("user");

    // Form States
    // Usuario
    const [name, setName] = useState(user?.name || "");
    const [language, setLanguage] = useState(user?.language || "es");
    const [timezone, setTimezone] = useState(user?.timezone || "America/Bogota");
    const [profileLogo, setProfileLogo] = useState(user?.profileLogo || "");
    const [country, setCountry] = useState(user?.country || "Colombia");

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
    const [stateRegion, setStateRegion] = useState(user?.state || "");
    const [city, setCity] = useState(user?.city || "");
    const [address, setAddress] = useState(user?.address || "");
    const [zipCode, setZipCode] = useState(user?.zipCode || "");

    // Facturación
    const [currency, setCurrency] = useState(user?.currency || "COP");
    const [invoicePrefix, setInvoicePrefix] = useState(user?.invoicePrefix || "FAC");
    const [invoiceInitialNumber, setInvoiceInitialNumber] = useState(user?.invoiceInitialNumber || 1);
    const [defaultTax, setDefaultTax] = useState(user?.defaultTax || "19");

    // Contacto
    const [phone, setPhone] = useState(user?.phone || "");
    const [billingEmail, setBillingEmail] = useState(user?.billingEmail || "");
    const [website, setWebsite] = useState(user?.website || "");

    const [isSaving, setIsSaving] = useState(false);

    if (!user) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    const hasChanges =
        name !== (user?.name || "") ||
        language !== (user?.language || "es") ||
        timezone !== (user?.timezone || "America/Bogota") ||
        country !== (user?.country || "Colombia") ||
        profileLogo !== (user?.profileLogo || "") ||
        companyLogo !== (user?.companyLogo || "") ||
        legalName !== (user?.legalName || "") ||
        businessType !== (user?.businessType || "") ||
        industry !== (user?.industry || "") ||
        taxIdentification !== (user?.taxIdentification || "") ||
        taxRegime !== (user?.taxRegime || "") ||
        taxResponsibilities !== (user?.taxResponsibilities || "") ||
        stateRegion !== (user?.state || "") ||
        city !== (user?.city || "") ||
        address !== (user?.address || "") ||
        zipCode !== (user?.zipCode || "") ||
        currency !== (user?.currency || "COP") ||
        invoicePrefix !== (user?.invoicePrefix || "FAC") ||
        String(invoiceInitialNumber) !== String(user?.invoiceInitialNumber || 1) ||
        defaultTax !== (user?.defaultTax || "19") ||
        phone !== (user?.phone || "") ||
        billingEmail !== (user?.billingEmail || "") ||
        website !== (user?.website || "");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setter(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.put("/api/auth/profile", {
                name, language, timezone, country, profileLogo,
                companyLogo, legalName, businessType, industry,
                companyName: user.companyName, // Keep untouched values
                taxIdentification, taxRegime, taxResponsibilities,
                state: stateRegion, city, address, zipCode,
                currency, invoicePrefix, invoiceInitialNumber: Number(invoiceInitialNumber), defaultTax,
                phone, billingEmail, website
            });
            toast.success("Configuración actualizada con éxito");
            refetch();
        } catch (error) {
            console.error(error);
            const errDecoded = error as any;
            const errText = errDecoded?.response?.data?.details || errDecoded?.message || "Error al actualizar";
            toast.error("Error: " + errText);
        } finally {
            setIsSaving(false);
        }
    };

    const membershipTier = "Free";

    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">

            {/* Header Sticky con Botón Guardar */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl border-b border-sidebar-border pb-6 pt-2 z-10 w-full">
                <div className="flex gap-4 items-center">
                    {companyLogo ? (
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-sidebar-border">
                            <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-800 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white font-bold text-2xl">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground">
                            Configuración
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Administra toda la información de tu espacio de trabajo
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 font-bold rounded-full flex items-center gap-2 text-sm ${membershipTier === 'Pro'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-foreground/5 text-foreground/60 border border-sidebar-border'
                        }`}>
                        {membershipTier === 'Pro' ? <Gem className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        Plan {membershipTier}
                    </div>
                    {hasChanges && (
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-purple-600 flex justify-center items-center py-2 cursor-pointer hover:bg-purple-700 text-white px-5 shadow-lg shadow-purple-500/20 animate-in zoom-in duration-300 rounded"
                        >
                            {isSaving ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-6 flex-1 items-start relative">

                {/* Menú Superior */}
                <nav className="flex w-full border-b border-sidebar-border gap-2 pb-2 scrollbar-hide sticky top-32 z-10 bg-background/80 backdrop-blur-md">
                    {TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all duration-200 min-w-max relative
                                ${active ? "text-purple-400 font-medium" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}
                            >
                                <tab.icon className={`w-4 h-4 ${active ? "text-purple-400" : "text-muted-foreground"}`} />
                                {tab.label}
                                {active && (
                                    <motion.div
                                        layoutId="activeTabBadge"
                                        className="absolute bottom-[-10px] left-0 right-0 h-1 bg-purple-500 rounded-t-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Contenido Dinámico */}
                <div className="flex-1 w-full bg-card border border-sidebar-border rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.25 }}
                        >
                            {activeTab === "user" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><UserCircle2 className="w-6 h-6 text-purple-500" /> Perfil de Usuario</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Tu información personal y preferencias base.</p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="col-span-1 border border-sidebar-border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 bg-background/30">
                                            {profileLogo ? (
                                                <img src={profileLogo} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-3xl font-bold shadow-md">
                                                    {name.charAt(0)}
                                                </div>
                                            )}
                                            <label className="text-sm font-medium text-purple-500 hover:text-purple-400 cursor-pointer transition">
                                                Cambiar foto
                                                <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={(e) => handleFileChange(e, setProfileLogo)} />
                                            </label>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-foreground/70 uppercase">Nombre Completo</label>
                                                <Input value={name} onChange={e => setName(e.target.value)} className="bg-background/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-foreground/70 uppercase flex items-center justify-between">Email de Acceso <Lock className="w-3 h-3 text-muted-foreground" /></label>
                                                <Input value={user.email} disabled className="bg-background/50 opacity-60" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Idioma</label>
                                            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="es">Español</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Zona Horaria</label>
                                            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="America/Bogota">Bogotá (GMT-5)</option>
                                                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "company" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6 text-purple-500" /> Información de la Empresa</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="col-span-full border border-sidebar-border rounded-xl p-4 flex items-center gap-6 bg-background/30">
                                            <div className="w-20 h-20 bg-secondary rounded-lg flex shrink-0 items-center justify-center overflow-hidden border">
                                                {companyLogo ? <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" /> : <UploadCloud className="text-muted-foreground opacity-50" />}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-purple-500 hover:text-purple-400 cursor-pointer">
                                                    Subir nuevo logo de empresa
                                                    <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={(e) => handleFileChange(e, setCompanyLogo)} />
                                                </label>
                                                <p className="text-xs text-muted-foreground">Formatos soportados: PNG, JPG, JPEG (Max 2MB. Usado en facturas).</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Nombre Legal / Razón Social</label>
                                            <Input value={legalName} onChange={e => setLegalName(e.target.value)} className="bg-background/50" placeholder="Ej. Simplapp Tech S.A.S" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Nombre Comercial</label>
                                            <Input value={user.companyName || ""} disabled title="Manejado en perfil principal" className="bg-background/50 opacity-60" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Tipo de Negocio</label>
                                            <select value={businessType} onChange={e => setBusinessType(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="">Selecciona...</option>
                                                <option value="startup">Startup</option>
                                                <option value="agency">Agencia</option>
                                                <option value="freelance">Independiente</option>
                                                <option value="retail">Retail / Tienda</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Industria / Sector</label>
                                            <Input value={industry} onChange={e => setIndustry(e.target.value)} className="bg-background/50" placeholder="Ej. Tecnología, Software, Belleza" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "fiscal" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-purple-500" /> Información Fiscal</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Identificación Fiscal (NIT / CC)</label>
                                            <Input value={taxIdentification} onChange={e => setTaxIdentification(e.target.value)} className="bg-background/50" placeholder="Ej. 901234567-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Régimen Tributario</label>
                                            <select value={taxRegime} onChange={e => setTaxRegime(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="">Selecciona...</option>
                                                <option value="Común">Régimen Común</option>
                                                <option value="Simplificado">Régimen Simplificado</option>
                                                <option value="Simple">Régimen Simple de Tributación</option>
                                            </select>
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Responsabilidades Fiscales</label>
                                            <Input value={taxResponsibilities} onChange={e => setTaxResponsibilities(e.target.value)} className="bg-background/50" placeholder="Ej. O-13 Gran Contribuyente, O-15 Autorretenedor" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "address" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6 text-purple-500" /> Dirección Fiscal</h2>
                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">País</label>
                                            <select value={country} onChange={e => setCountry(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="Colombia">🇨🇴 Colombia</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Departamento</label>
                                            <Input value={stateRegion} onChange={e => setStateRegion(e.target.value)} className="bg-background/50" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Ciudad</label>
                                            <Input value={city} onChange={e => setCity(e.target.value)} className="bg-background/50" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Código Postal</label>
                                            <Input value={zipCode} onChange={e => setZipCode(e.target.value)} className="bg-background/50" placeholder="Ej. 110111" />
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Dirección de Oficina</label>
                                            <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-background/50" placeholder="Ej. Calle 123 # 45-67 Piso 2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "billing" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-purple-500" /> Facturación y Moneda</h2>
                                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Moneda Base</label>
                                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none">
                                                <option value="COP">COP ($)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Impuesto por Defecto (%)</label>
                                            <Input value={defaultTax} onChange={e => setDefaultTax(e.target.value)} type="number" className="bg-background/50" />
                                        </div>
                                        <div className="col-span-full border-t border-sidebar-border my-2"></div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Prefijo de Factura</label>
                                            <Input value={invoicePrefix} onChange={e => setInvoicePrefix(e.target.value)} className="bg-background/50 uppercase" placeholder="FAC" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Siguiente Consecutivo</label>
                                            <Input value={invoiceInitialNumber} onChange={e => setInvoiceInitialNumber(Number(e.target.value))} type="number" min="1" className="bg-background/50" />
                                        </div>
                                        <div className="col-span-full bg-blue-500/10 text-blue-400 p-4 rounded-xl border border-blue-500/20 text-sm">
                                            Tu próxima factura será generada como: <strong>{invoicePrefix}-{invoiceInitialNumber}</strong>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "contact" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><Phone className="w-6 h-6 text-purple-500" /> Contacto Empresarial</h2>
                                    <p className="text-sm text-muted-foreground mb-6">Esta información aparecerá visible en tus facturas.</p>
                                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Teléfono de Soporte</label>
                                            <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-background/50" placeholder="+57 300 000 0000" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Email de Facturación</label>
                                            <Input value={billingEmail} onChange={e => setBillingEmail(e.target.value)} type="email" className="bg-background/50" placeholder="facturacion@empresa.com" />
                                        </div>
                                        <div className="col-span-full space-y-1">
                                            <label className="text-xs font-semibold text-foreground/70 uppercase">Sitio Web</label>
                                            <Input value={website} onChange={e => setWebsite(e.target.value)} className="bg-background/50" placeholder="https://miempresa.com" />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}
