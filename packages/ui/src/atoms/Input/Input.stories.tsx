import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

/**
 * Input estándar del design system de Simplapp.
 *
 * ### Variantes de uso
 * - Texto, email, password, number, date, file
 * - Con estado de error (`aria-invalid`)
 * - Deshabilitado
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Input base del sistema. Usa \`aria-invalid\` para mostrar el estado de error
sin necesidad de clases adicionales.
        `,
      },
    },
  },
  argTypes: {
    type:        { control: 'select', options: ['text', 'email', 'password', 'number', 'date', 'file'], description: 'Tipo HTML del input' },
    placeholder: { control: 'text' },
    disabled:    { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Escribe algo aquí...', type: 'text' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'correo@empresa.com' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
};

export const Number: Story = {
  args: { type: 'number', placeholder: '0' },
};

export const Date: Story = {
  args: { type: 'date' },
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: { placeholder: 'No editable', disabled: true },
};

export const ConError: Story = {
  name: 'Con error (aria-invalid)',
  args: {
    placeholder: 'Campo requerido',
    'aria-invalid': true,
    defaultValue: 'valor inválido',
  },
};

/** Comparativa de todos los estados. */
export const Comparativa: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <Input placeholder="Normal" />
      <Input placeholder="Con valor" defaultValue="Texto ingresado" />
      <Input placeholder="Deshabilitado" disabled />
      <Input placeholder="Con error" aria-invalid defaultValue="dato incorrecto" />
    </div>
  ),
};
