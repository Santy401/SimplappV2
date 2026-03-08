import type { Meta, StoryObj } from '@storybook/react';
import { FormModalLayout } from './FormModalLayout';
import { FormSection } from '../FormSection/FormSection';
import { Input } from '../../atoms/Input/Input';
import { Label } from '../../atoms/Label/Label';

const meta: Meta<typeof FormModalLayout> = {
  title: 'Molecules/FormModalLayout',
  component: FormModalLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title:       { control: 'text' },
    submitLabel: { control: 'text' },
    isLoading:   { control: 'boolean' },
    maxWidth:    { control: 'select', options: ['sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl'] },
    onSubmit:    { action: 'onSubmit' },
    onCancel:    { action: 'onCancel' },
    onDelete:    { action: 'onDelete' },
  },
};
export default meta;
type Story = StoryObj<typeof FormModalLayout>;

const Fields = () => (
  <FormSection title="Información básica" columns={2}>
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nombre</Label>
      <Input placeholder="Ej: Juan Pérez" />
    </div>
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
      <Input type="email" placeholder="correo@empresa.com" />
    </div>
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Teléfono</Label>
      <Input placeholder="+57 300 000 0000" />
    </div>
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ciudad</Label>
      <Input placeholder="Bogotá" />
    </div>
  </FormSection>
);

export const Creacion: Story = {
  name: 'Crear registro',
  args: { title: 'Nuevo cliente', submitLabel: 'Crear cliente', maxWidth: '3xl', onSubmit: (e: React.FormEvent) => { e.preventDefault(); }, onCancel: () => {} },
  render: (args) => <FormModalLayout {...args}><Fields /></FormModalLayout>,
};

export const Edicion: Story = {
  name: 'Editar registro',
  args: { title: 'Editar cliente', maxWidth: '3xl', onSubmit: (e: React.FormEvent) => { e.preventDefault(); }, onCancel: () => {}, onDelete: () => {} },
  render: (args) => <FormModalLayout {...args}><Fields /></FormModalLayout>,
};

export const Cargando: Story = {
  name: 'Guardando... (isLoading)',
  args: { title: 'Editando cliente', isLoading: true, maxWidth: '3xl', onSubmit: (e: React.FormEvent) => { e.preventDefault(); }, onCancel: () => {} },
  render: (args) => <FormModalLayout {...args}><Fields /></FormModalLayout>,
};
