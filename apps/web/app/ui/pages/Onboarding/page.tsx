'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@simplapp/ui';
import { Building2, UserCircle2, ArrowRight, CheckCircle2, UploadCloud, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@interfaces/lib/api-client';
import { useSession } from '@hooks/features/auth/use-session';

export default function OnboardingPage() {
    const router = useRouter();
    const { refetch } = useSession();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [userType, setUserType] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [country, setCountry] = useState<string>('Colombia');
    const [currency, setCurrency] = useState<string>('COP');
    const [companyLogo, setCompanyLogo] = useState<string>('');
    const [invoicePrefix, setInvoicePrefix] = useState<string>('FAC');
    const [defaultTax, setDefaultTax] = useState<string>('19');

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCompanyLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await apiClient.post('/api/auth/onboarding', {
                userType,
                companyName,
                country,
                currency,
                companyLogo,
                invoicePrefix,
                defaultTax
            });

            setStep(5); // Ir a la pantalla final
            refetch(); // Refrescar la sesión para aplicar onboardingCompleted

        } catch (error) {
            console.error('Error al guardar onboarding:', error);
            toast.error('Ocurrió un error al guardar tu información.');
        } finally {
            setLoading(false);
        }
    };

    const finishOnboarding = () => {
        router.push('/ui/pages/Admin/Index');
    };

    // Componentes para los Pasos
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="step1"
                        className="text-center space-y-6"
                    >
                        <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Rocket className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Bienvenido a Simplapp</h2>
                        <p className="text-muted-foreground">Te ayudaremos a configurar tu espacio en menos de un minuto.</p>

                        <Button
                            className="bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-700 text-white w-full rounded py-6 mt-8 shadow-lg shadow-purple-500/20"
                            onClick={handleNext}
                        >
                            Comenzar <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step2"
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-foreground text-center">¿Cómo usarás el sistema?</h2>
                        <p className="text-muted-foreground text-center">Elige el perfil que mejor te identifique</p>

                        <div className="grid gap-4 mt-8">
                            <button
                                onClick={() => setUserType('Emprendedor')}
                                className={`flex items-center p-4 border rounded-xl transition-all duration-200 ${userType === 'Emprendedor' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-sidebar-border hover:bg-secondary/50'
                                    }`}
                            >
                                <UserCircle2 className="w-6 h-6 mr-4" />
                                <div className="text-left flex-1">
                                    <h3 className="font-semibold text-foreground">Emprendedor</h3>
                                </div>
                                {userType === 'Emprendedor' && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                            </button>

                            <button
                                onClick={() => setUserType('Empresa')}
                                className={`flex items-center p-4 border rounded-xl transition-all duration-200 ${userType === 'Empresa' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-sidebar-border hover:bg-secondary/50'
                                    }`}
                            >
                                <Building2 className="w-6 h-6 mr-4" />
                                <div className="text-left flex-1">
                                    <h3 className="font-semibold text-foreground">Empresa</h3>
                                </div>
                                {userType === 'Empresa' && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                            </button>
                        </div>

                        <div className="flex gap-3-6 pt-6">
                            <Button variant="outline" onClick={handleBack} className="flex-1 py-4 rounded-xl cursor-pointer">Atrás</Button>
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white flex-[2] py-4 rounded-xl cursor-pointer"
                                disabled={!userType}
                                onClick={handleNext}
                            >
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step3"
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-foreground text-center">Información de Negocio</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre comercial</label>
                                <Input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Ej. Mi Tienda"
                                    className="bg-background/50 border-sidebar-border"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">País</label>
                                    <select
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    >
                                        <option value="Colombia">🇨🇴 Colombia</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Moneda</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full h-10 px-3 rounded-md bg-background/50 border border-sidebar-border text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    >
                                        <option value="COP">COP ($)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Logo (Opcional)</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 border border-sidebar-border rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition w-full justify-center text-muted-foreground">
                                        <UploadCloud className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sube tu logo (.png, .jpg)</span>
                                        <input
                                            type="file"
                                            accept=".png, .jpg, .jpeg, .ico"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                {companyLogo && (
                                    <span className="text-xs text-green-500 font-medium flex items-center gap-1">✓ Archivo cargado</span>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6">
                            <Button variant="outline" onClick={handleBack} className="flex-1 py-4 rounded-xl cursor-pointer">Atrás</Button>
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white flex-[2] py-4 rounded-xl cursor-pointer"
                                disabled={!companyName.trim()}
                                onClick={handleNext}
                            >
                                Continuar
                            </Button>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="step4"
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-foreground text-center">Configuración de Facturación</h2>
                        <p className="text-muted-foreground text-center">Datos rápidos para que puedas facturar hoy mismo</p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prefijo de Factura</label>
                                <Input
                                    value={invoicePrefix}
                                    onChange={(e) => setInvoicePrefix(e.target.value)}
                                    placeholder="Ej. FAC"
                                    className="bg-background/50 border-sidebar-border uppercase"
                                    maxLength={4}
                                />
                                <p className="text-xs text-muted-foreground">Identificador para tus documentos (Ej. FAC-001)</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Impuesto por Defecto (%)</label>
                                <Input
                                    value={defaultTax}
                                    onChange={(e) => setDefaultTax(e.target.value)}
                                    placeholder="19"
                                    type="number"
                                    className="bg-background/50 border-sidebar-border"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6">
                            <Button variant="outline" onClick={handleBack} className="flex-1 py-4 rounded-xl cursor-pointer" disabled={loading}>Atrás</Button>
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white flex-[2] py-4 rounded-xl cursor-pointer"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Finalizando...' : 'Completar y Guardar'}
                            </Button>
                        </div>
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="step5"
                        className="text-center space-y-6"
                    >
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Tu espacio está listo</h2>
                        <p className="text-muted-foreground">Ya puedes crear tu primera factura.</p>

                        <Button
                            className="bg-purple-600 flex items-center justify-center cursor-pointer  hover:bg-purple-700 text-white w-full rounded py-6 mt-8 shadow-lg shadow-purple-500/20"
                            onClick={finishOnboarding}
                        >
                            Ir al dashboard <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-screen bg-background flex flex-col items-center justify-center p-4">

            {/* Ocultamos Progress Bar en Welcome y Success */}
            {step > 1 && step < 5 && (
                <div className="w-full max-w-md mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Paso {step - 1} de 3
                        </span>
                        <span className="text-sm font-medium text-purple-500">
                            {Math.round(((step - 1) / 3) * 100)}% Completado
                        </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="w-full max-w-md bg-card border border-sidebar-border p-8 rounded-3xl shadow-xl">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>
        </div>
    );
}