import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { Input } from '../Input/Input';
import { Checkbox } from '../Checkbox/Checkbox';

/**
 * Label accesible basado en Radix UI.
 * Se conecta automáticamente al control por `htmlFor` / `id`.
 *
 * ### Estilo Simplapp
 * Para formularios, siempre usar con:
 * ```tsx
 * className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
 * ```
 */
const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Label accesible que implementa la firma tipográfica de Simplapp en formularios.
Siempre conectado a un control con \`htmlFor\`.
        `,
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/** Label estándar de Simplapp — uppercase + tracking. */
export const SimplappStyle: Story = {
  name: 'Estilo Simplapp (uppercase + tracking)',
  render: () => (
    <div className="space-y-1.5 w-64">
      <Label
        htmlFor="demo-input"
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        Nombre del cliente
      </Label>
      <Input id="demo-input" placeholder="Ej: Juan Pérez" />
    </div>
  ),
};

/** Label con campo requerido (asterisco en color de marca). */
export const Requerido: Story = {
  name: 'Campo requerido',
  render: () => (
    <div className="space-y-1.5 w-64">
      <Label
        htmlFor="demo-required"
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1"
      >
        Cuenta bancaria
        <span className="text-brand font-bold leading-none">*</span>
      </Label>
      <Input id="demo-required" placeholder="Seleccionar cuenta" />
    </div>
  ),
};

/** Label junto a un Checkbox. */
export const ConCheckbox: Story = {
  name: 'Con Checkbox',
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="text-sm cursor-pointer">
        Acepto los términos y condiciones
      </Label>
    </div>
  ),
};
