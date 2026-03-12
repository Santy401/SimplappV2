import type { Meta, StoryObj } from '@storybook/react';
import { FormSection } from './FormSection';
import { Input } from '../../atoms/Input/Input';
import { Label } from '../../atoms/Label/Label';

const meta: Meta<typeof FormSection> = {
  title: 'Molecules/FormSection',
  component: FormSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4] },
    gap:     { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    title:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof FormSection>;

const F = ({ label }: { label: string }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
    <Input placeholder={`Ingresa ${label.toLowerCase()}`} />
  </div>
);

export const DosColumnas: Story = {
  name: '2 columnas',
  args: { title: 'Información del cliente', description: 'Datos de identificación.', columns: 2, gap: 'md' },
  render: (args) => <FormSection {...args}><F label="Nombre" /><F label="NIT" /><F label="Email" /><F label="Teléfono" /></FormSection>,
};

export const TresColumnas: Story = {
  name: '3 columnas',
  args: { columns: 3, gap: 'md' },
  render: (args) => <FormSection {...args}><F label="País" /><F label="Departamento" /><F label="Municipio" /></FormSection>,
};

export const UnaColumna: Story = {
  name: '1 columna',
  args: { title: 'Notas', columns: 1, gap: 'sm' },
  render: (args) => <FormSection {...args}><F label="Observaciones" /><F label="Condiciones" /></FormSection>,
};
