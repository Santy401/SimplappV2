import type { Meta, StoryObj } from '@storybook/react';
import { PageSkeleton } from './PageSkeleton';

const meta: Meta<typeof PageSkeleton> = {
  title: 'Molecules/PageSkeleton',
  component: PageSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Skeleton de página completa que imita el layout estándar de Simplapp:
header con título + botones, cards KPI opcionales y tabla de datos.
Úsalo en \`loading.tsx\` mientras la página carga datos del servidor.
      `,
      },
    },
  },
  argTypes: {
    cardsCount: { control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Número de cards KPI a mostrar (0 = sin cards)' },
  },
};
export default meta;
type Story = StoryObj<typeof PageSkeleton>;

export const SinCards: Story = {
  name: 'Solo tabla (sin cards)',
  args: { cardsCount: 0 },
};

export const TresCards: Story = {
  name: 'Con 3 KPI cards',
  args: { cardsCount: 3 },
};

export const CincoCards: Story = {
  name: 'Con 5 KPI cards',
  args: { cardsCount: 5 },
};
