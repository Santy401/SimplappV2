import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { notify } from '@simplapp/interfaces';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estilos Premium Simplapp para Storybook
const NotificationStyles = () => (
  <style>{`
    .simplapp-toast {
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(12px) !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid rgba(0, 0, 0, 0.05) !important;
      padding: 12px 16px !important;
      font-family: sans-serif !important;
    }
    .simplapp-toast-success { border-left: 4px solid #10b981 !important; }
    .simplapp-toast-error { border-left: 4px solid #ef4444 !important; }
    .simplapp-toast-info { border-left: 4px solid #3b82f6 !important; }
    .simplapp-toast-warn { border-left: 4px solid #f59e0b !important; }
    .simplapp-toast-loading { border-left: 4px solid #6C47FF !important; }
    .Toastify__toast-body { font-size: 14px; font-weight: 500; color: #1f2937; }
  `}</style>
);

const NotificationBase = ({ type, title, description, actionText }: any) => {
  const trigger = () => {
    switch (type) {
      case 'success': notify.success(description); break;
      case 'error': notify.error(description); break;
      case 'info': notify.info(description); break;
      case 'warn': notify.warn(description); break;
      case 'loading': notify.loading(description); break;
      case 'promise': 
        notify.promise(new Promise(r => setTimeout(resolve, 2000)), {
          loading: 'Procesando...',
          success: '¡Completado!',
          error: 'Error',
        });
        break;
    }
  };

  return (
    <div className="p-10 bg-slate-50 min-h-[300px] flex flex-col items-center justify-center space-y-6 rounded-xl border border-dashed border-slate-300">
      <NotificationStyles />
      <ToastContainer position="top-center" transition={Slide} toastClassName="simplapp-toast" hideProgressBar />
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 max-w-xs">{description}</p>
      </div>

      <Button onClick={trigger} variant={type === 'error' ? 'destructive' : 'default'} className="shadow-lg">
        {actionText}
      </Button>
    </div>
  );
};

const meta: Meta<typeof NotificationBase> = {
  title: 'Atoms/Notifications',
  component: NotificationBase,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NotificationBase>;

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Modo Éxito',
    description: 'La factura se ha generado y enviado a la DIAN correctamente.',
    actionText: 'Probar Success',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Modo Error',
    description: 'No se pudo conectar con el servidor. Verifica tu conexión.',
    actionText: 'Probar Error',
  },
};

export const Information: Story = {
  args: {
    type: 'info',
    title: 'Modo Información',
    description: 'Hay una nueva versión de Simplapp disponible con mejoras en POS.',
    actionText: 'Probar Info',
  },
};

export const Warning: Story = {
  args: {
    type: 'warn',
    title: 'Modo Advertencia',
    description: 'Tu certificado digital está a punto de vencer (3 días restantes).',
    actionText: 'Probar Warning',
  },
};

export const Loading: Story = {
  args: {
    type: 'loading',
    title: 'Modo Carga',
    description: 'Estamos sincronizando tus inventarios con la nube...',
    actionText: 'Probar Loading',
  },
};
