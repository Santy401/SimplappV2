import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

/**
 * Checkbox accesible basado en Radix UI.
 *
 * ### Uso típico
 * - Selección múltiple en formularios
 * - Columna de selección en DataTable
 * - Confirmación de términos y condiciones
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Checkbox accesible con soporte para teclado y screen readers.
Integra con los estilos del tema dark/light automáticamente.
        `,
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    checked:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  name: 'Sin marcar',
  args: { checked: false },
};

export const Checked: Story = {
  name: 'Marcado',
  args: { checked: true },
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: { disabled: true, checked: false },
};

export const DisabledChecked: Story = {
  name: 'Deshabilitado + marcado',
  args: { disabled: true, checked: true },
};

/** Estados comparados lado a lado. */
export const Comparativa: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="c1" />
        <label htmlFor="c1" className="text-sm text-muted-foreground">Sin marcar</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c2" defaultChecked />
        <label htmlFor="c2" className="text-sm text-muted-foreground">Marcado</label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c3" disabled />
        <label htmlFor="c3" className="text-sm text-muted-foreground">Deshabilitado</label>
      </div>
    </div>
  ),
};
