'use client';

import React from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { useSession } from '@hooks/features/auth/use-session';
import { 
  SettingsModal as UISettingsModal, 
  ProfileSettings, 
  CompanySettings,
  SettingsView
} from '@simplapp/ui';

// Importamos los componentes locales que aún no hemos movido a UI si existen
import { BillingSettings } from './BillingSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { BankAccountsSettings } from './BankAccountsSettings';

export function SettingsModal() {
    const { isOpen, currentView, setCurrentView, closeSettings } = useSettings();
    const { user } = useSession();

    const handleSaveProfile = async (data: any) => {
        console.log("Saving profile in Web:", data);
        // Aquí iría la lógica de API de la web
    };

    const handleSaveCompany = async (data: any) => {
        console.log("Saving company in Web:", data);
        // Aquí iría la lógica de API de la web
    };

    const renderContent = () => {
        switch (currentView) {
            case 'perfil':
                return <ProfileSettings user={user} onSave={handleSaveProfile} />;
            case 'empresa':
                return <CompanySettings company={user?.companies?.[0]?.company} onSave={handleSaveCompany} />;
            case 'facturacion':
                return <BillingSettings />;
            case 'suscripcion':
                return <SubscriptionSettings />;
            case 'bancos':
                return <BankAccountsSettings />;
            default:
                return (
                    <div className="py-20 text-center">
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Próximamente</h3>
                        <p className="text-sm text-slate-500 mt-2">Estamos trabajando en la sección de {currentView}.</p>
                    </div>
                );
        }
    };

    return (
        <UISettingsModal
            isOpen={isOpen}
            onClose={closeSettings}
            currentView={currentView as SettingsView}
            onViewChange={(v) => setCurrentView(v as any)}
        >
            {renderContent()}
        </UISettingsModal>
    );
}
