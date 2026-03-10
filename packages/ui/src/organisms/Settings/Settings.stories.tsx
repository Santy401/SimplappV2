import type { Meta, StoryObj } from '@storybook/react';
import { SettingsModal, SettingsView } from './SettingsModal';
import { ProfileSettings } from './ProfileSettings';
import { CompanySettings } from './CompanySettings';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Organisms/Settings',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const FullSettingsExperience: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [view, setView] = useState<SettingsView>('perfil');

    const mockUser = {
      name: 'Alexander García',
      email: 'alexander@empresa.com',
      profileLogo: null
    };

    const mockCompany = {
      companyName: 'Simplapp Enterprise',
      identificationNumber: '900.123.456-7',
      address: 'Calle 100 #15-30, Bogotá',
      phone: '+57 300 123 4567',
      logoUrl: null
    };

    const renderContent = () => {
      switch (view) {
        case 'perfil':
          return <ProfileSettings user={mockUser} onSave={async (d) => console.log('Save profile', d)} />;
        case 'empresa':
          return <CompanySettings company={mockCompany} onSave={async (d) => console.log('Save company', d)} />;
        default:
          return (
            <div className="py-20 text-center">
              <h3 className="text-xl font-bold text-slate-400">Próximamente: {view}</h3>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg"
        >
          Abrir Ajustes
        </button>
        
        <SettingsModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          currentView={view}
          onViewChange={setView}
        >
          {renderContent()}
        </SettingsModal>
      </div>
    );
  }
};
