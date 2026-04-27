'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { useSession } from '@hooks/features/auth/use-session';
import { 
  SettingsModal as UISettingsModal, 
  ProfileSettings, 
  CompanySettings,
  SettingsView
} from '@simplapp/ui';

// Importamos los componentes locales
import { BillingSettings } from './BillingSettings';
import { SubscriptionSettings } from './SubscriptionSettings';
import { BankAccountsSettings } from './BankAccountsSettings';

export function SettingsModal() {
    const { isOpen, currentView, setCurrentView, closeSettings } = useSettings();
    const { user } = useSession();
    const [saving, setSaving] = useState(false);
    const [key, setKey] = useState(0); // Force re-render

    // Refresh session when modal opens
    useEffect(() => {
        if (isOpen) {
            setKey(k => k + 1);
        }
    }, [isOpen]);

    const handleSaveProfile = async (data: any) => {
        console.log("Saving profile in Web:", data);
    };

    const handleSaveCompany = async (data: any) => {
        setSaving(true);
        try {
            const companyId = user?.companyId;
            
            if (!companyId) {
                console.error("No company ID found");
                return;
            }

            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: data.companyName,
                    taxIdentification: data.identificationNumber,
                    companyLogo: data.logoUrl,
                    address: data.address,
                    phone: data.phone
                })
            });

            if (response.ok) {
                console.log("Company saved successfully");
                // Close modal - when reopened it will fetch fresh data
                closeSettings();
            } else {
                const err = await response.json();
                console.error("Error saving company:", err);
            }
        } catch (error) {
            console.error("Error saving company:", error);
        } finally {
            setSaving(false);
        }
    };

    const renderContent = () => {
        // Extraemos los datos de la empresa desde la sesión
        const companyData = {
          companyName: user?.companyName || '',
          identificationNumber: user?.taxIdentification || '',
          address: user?.address || '',
          phone: user?.phone || '',
          logoUrl: user?.companyLogo || null
        };

        switch (currentView) {
            case 'perfil':
                return <ProfileSettings user={user} onSave={handleSaveProfile} />;
            case 'empresa':
                return <CompanySettings company={companyData} onSave={handleSaveCompany} />;
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
