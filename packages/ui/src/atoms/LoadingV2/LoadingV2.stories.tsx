import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from './Loading';

/**
 * Loading V2 — animación de barras de onda.
 * Spinner complementario para contextos pequeños dentro de la UI.
 */
const meta: Meta<typeof Loading> = {
  title: 'Atoms/LoadingV2',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Animación de barras sincronizadas (LoadingWave). Ideal para estados de carga
dentro de paneles o modales, donde un spinner de pantalla completa sería excesivo.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  name: 'Loading wave',
};

export const EnCard: Story = {
  name: 'Dentro de una card',
  render: () => (
    <div className="flex items-center justify-center w-64 h-32 border border-[#ddd] dark:border-[#2d2d2d] rounded-xl bg-white dark:bg-[#141414]">
      <Loading />
    </div>
  ),
};
