import type { Meta, StoryObj } from '@storybook/react';
import { Onboarding } from './Onboarding';

const meta: Meta<typeof Onboarding> = {
  title: 'Organisms/Onboarding',
  component: Onboarding,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Onboarding>;

export const Default: Story = {
  args: {
    initialData: {
      country: 'Colombia',
      currency: 'COP',
    },
    onSubmit: async (data) => {
      console.log('Onboarding data submitted:', data);
      // Simular retraso de API
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onFinish: () => {
      alert('Onboarding finalizado con éxito. Redirigiendo al dashboard...');
    },
  },
};

/**
 * Versión con datos precargados (ejemplo: usuario que ya inició y vuelve).
 */
export const Preloaded: Story = {
  args: {
    ...Default.args,
    initialData: {
      userType: 'Empresa',
      companyName: 'Simplapp Enterprise',
      country: 'Colombia',
      currency: 'COP',
      invoicePrefix: 'ERP',
      defaultTax: '19',
    },
  },
};
