import type { Meta, StoryObj } from '@storybook/react';
import { InputCurrency } from './InputCurrency';
import { useState } from 'react';

/**
 * Input de valor monetario con formateo automático para el locale `es-CO`.
 *
 * ### Características:
 * - Muestra el número formateado con separadores de miles al perder foco
 * - Al hacer foco muestra el número crudo para facilitar la edición
 * - Aceita coma o punto como separador decimal
 * - Valor interno siempre es `number`, no string
 */
const meta: Meta<typeof InputCurrency> = {
  title: 'Atoms/InputCurrency',
  component: InputCurrency,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Input especializado para valores monetarios en formato colombiano (COP).
El valor siempre se maneja como \`number\` internamente — no hay strings.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputCurrency>;

/** Interactivo — edita el valor y ve cómo formatea al perder foco. */
export const Default: Story = {
  name: 'Interactivo (prueba el formateo)',
  render: () => {
    const [value, setValue] = useState(1500000);
    return (
      <div className="w-64 space-y-2">
        <InputCurrency value={value} onChange={setValue} className="text-right" />
        <p className="text-xs text-muted-foreground">
          Valor interno: <code className="font-mono">{value}</code>
        </p>
      </div>
    );
  },
};

export const ValorCero: Story = {
  name: 'Valor cero',
  render: () => {
    const [value, setValue] = useState(0);
    return <InputCurrency value={value} onChange={setValue} className="w-48 text-right" />;
  },
};

export const ValorGrande: Story = {
  name: 'Valor grande (millones)',
  render: () => {
    const [value, setValue] = useState(25000000);
    return <InputCurrency value={value} onChange={setValue} className="w-48 text-right" />;
  },
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  render: () => (
    <InputCurrency value={350000} onChange={() => {}} disabled className="w-48 text-right" />
  ),
};
