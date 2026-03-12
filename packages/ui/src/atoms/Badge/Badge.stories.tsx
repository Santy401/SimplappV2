import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

/**
 * Badge / Chip para etiquetar estados en tablas, listas y tarjetas.
 *
 * ### Variantes disponibles:
 * - `default` — gris neutro (estado pendiente / borrador)
 * - `active` — verde (activo / pagado / completado)
 * - `destructive` — rojo (cancelado / error / vencido)
 * - `secondary` — gris oscuro (secundario / inactivo)
 * - `outline` — solo borde (tag informativo sin énfasis)
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Cuándo usarlo
- Indicar el estado de un registro (activo, cancelado, vencido, etc.)
- Etiquetas en listas y tablas
- Contadores / chips pequeños

### Cuándo NO usarlo
- Para mostrar métricas numéricas grandes → usar cards de KPI
- Para acciones del usuario → usar Button
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'active', 'destructive', 'secondary', 'outline'],
      description: 'Estilo visual del badge',
    },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: 'default', children: 'Pendiente' },
};

export const Activo: Story = {
  args: { variant: 'active', children: 'Activo' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Cancelado' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Inactivo' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Borrador' },
};

/** Muestra todas las variantes juntas para comparar. */
export const TodasLasVariantes: Story = {
  name: 'Comparativa de variantes',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Pendiente</Badge>
      <Badge variant="active">Pagado</Badge>
      <Badge variant="destructive">Vencido</Badge>
      <Badge variant="secondary">Inactivo</Badge>
      <Badge variant="outline">Borrador</Badge>
    </div>
  ),
};
