import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

/**
 * Textarea estándar de Simplapp.
 * Usado para campos de texto largo: notas, descripciones, observaciones.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Textarea base del sistema. Soporta \`resize-none\` para altura fija
y \`aria-invalid\` para el estado de error.
        `,
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled:    { control: 'boolean' },
    rows:        { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Agrega una nota o descripción...',
    className: 'w-72 min-h-[88px] resize-none',
  },
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  args: {
    placeholder: 'No editable',
    disabled: true,
    className: 'w-72',
  },
};

export const ConError: Story = {
  name: 'Con error',
  args: {
    'aria-invalid': true,
    defaultValue: 'Texto inválido aquí',
    className: 'w-72',
  },
};

export const Notas: Story = {
  name: 'Caso de uso — Notas de impresión',
  args: {
    placeholder: 'Agrega detalles adicionales que serán visibles en la impresión.',
    className: 'w-72 min-h-[88px] resize-none text-sm',
  },
};
