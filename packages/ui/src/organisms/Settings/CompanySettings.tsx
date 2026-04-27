'use client';

import React, { useState, useRef } from 'react';
import { Building2, UploadCloud, MapPin, Phone, Hash } from 'lucide-react';
import { SettingsSection, SettingsGroup, SettingsField, SettingsAction } from './SettingsAtoms';
import { Input } from '../../atoms/Input/Input';

interface CompanySettingsProps {
  company: any;
  onSave: (data: any) => Promise<void>;
}

export function CompanySettings({ company, onSave }: CompanySettingsProps) {
  const [formData, setFormData] = useState({
    companyName: company?.companyName || '',
    identificationNumber: company?.identificationNumber || '',
    address: company?.address || '',
    phone: company?.phone || '',
    logoUrl: company?.logoUrl || null
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsSection 
      title="Información de la Empresa" 
      description="Configura los datos legales y comerciales de tu organización."
    >
      <SettingsGroup>
        <div className="space-y-8">
          {/* Logo Upload */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 size={32} className="text-slate-300" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Logo de la empresa</h4>
              <p className="text-xs text-slate-400 font-medium mt-1">Este logo aparecerá en todas tus facturas y reportes.</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleLogoChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <UploadCloud size={14} />
                Cambiar Imagen
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <SettingsField label="Nombre comercial">
              <Input 
                value={formData.companyName} 
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ej: Innova Tech S.A.S"
              />
            </SettingsField>

            <SettingsField label="Número de identificación (NIT)">
              <Input 
                value={formData.identificationNumber} 
                onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                placeholder="900.000.000-1"
              />
            </SettingsField>

            <SettingsField label="Dirección física">
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle 100 #15-30, Bogotá"
              />
            </SettingsField>

            <SettingsField label="Teléfono corporativo">
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+57 300 123 4567"
              />
            </SettingsField>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <SettingsAction 
            label="Actualizar Empresa" 
            onClick={handleSave} 
            isLoading={isLoading} 
          />
        </div>
      </SettingsGroup>
    </SettingsSection>
  );
}
