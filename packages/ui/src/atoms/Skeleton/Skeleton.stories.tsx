import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

/**
 * Skeleton — placeholder de carga para contenido que aún no ha llegado.
 *
 * ### Uso
 * Reemplaza cualquier elemento visual con una versión animada de su forma.
 * Úsalo en `loading.tsx` o cuando `isLoading === true`.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Bloque animado de carga. Acepta cualquier clase de Tailwind para controlar
dimensiones y forma. Úsalo en lugar del contenido real mientras carga.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  name: 'Línea de texto',
  render: () => <Skeleton className="h-4 w-48" />,
};

export const Avatar: Story = {
  name: 'Avatar circular',
  render: () => <Skeleton className="h-10 w-10 rounded-full" />,
};

export const Card: Story = {
  name: 'Card completa',
  render: () => (
    <div className="w-72 space-y-3 p-4 border border-[#ddd] dark:border-[#2d2d2d] rounded-xl">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  ),
};

export const TableRow: Story = {
  name: 'Fila de tabla',
  render: () => (
    <div className="w-96 divide-y divide-[#ddd] dark:divide-[#2d2d2d]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  ),
};

export const Badge: Story = {
  name: 'Badge / Pill',
  render: () => <Skeleton className="h-5 w-16 rounded-full" />,
};
