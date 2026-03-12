'use client';

import React, { useState } from 'react';
import { User, Mail, Camera, Save } from 'lucide-react';
import { SettingsSection, SettingsGroup, SettingsField, SettingsAction } from './SettingsAtoms';
import { Input } from '../../atoms/Input/Input';

interface ProfileSettingsProps {
  user: any;
  onSave: (data: any) => Promise<void>;
}

export function ProfileSettings({ user, onSave }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.profileLogo || null
  });
  const [isLoading, setIsLoading] = useState(false);

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
      title="Perfil Personal" 
      description="Gestiona tu información pública y la identidad de tu cuenta."
    >
      <SettingsGroup>
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-900 shadow-xl">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-300" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 w-full space-y-6">
            <SettingsField 
              label="Nombre completo" 
              description="Cómo te verán otros miembros de tu organización."
            >
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Alexander García"
              />
            </SettingsField>

            <SettingsField 
              label="Correo electrónico" 
              description="La dirección principal vinculada a tu cuenta Simplapp."
            >
              <Input 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alexander@empresa.com"
                disabled
              />
            </SettingsField>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <SettingsAction 
            label="Guardar Cambios" 
            onClick={handleSave} 
            isLoading={isLoading} 
          />
        </div>
      </SettingsGroup>
    </SettingsSection>
  );
}
