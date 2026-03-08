import type { Meta, StoryObj } from '@storybook/react';
import { InputField, CurrencyField, TextareaField, SelectField, CheckboxField } from './FormFields';
import { useState } from 'react';

/**
 * Colección de campos de formulario pre-empaquetados de Simplapp.
 * Cada campo combina Label + Input/Select/Textarea con soporte de error y helpText.
 */
const meta: Meta = {
  title: 'Molecules/FormFields',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Campos de formulario listos para usar que combinan Label + control + mensajes de error/ayuda.
Úsalos dentro de \`<FormSection>\` para construir formularios consistentes con el design system.
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const TodosLosFormatos: Story = {
  name: 'Todos los tipos de campo',
  render: () => {
    const [text, setText] = useState('');
    const [currency, setCurrency] = useState(0);
    const [textarea, setTextarea] = useState('');
    const [select, setSelect] = useState('');
    const [check, setCheck] = useState(false);
    return (
      <div className="w-full max-w-xl space-y-5">
        <InputField label="Nombre completo" value={text} onChange={setText} placeholder="Ej: Juan Pérez" required />
        <CurrencyField label="Valor" value={currency} onChange={setCurrency} required />
        <SelectField label="Método de pago" value={select} onChange={setSelect} options={[{ value: 'efectivo', label: 'Efectivo' }, { value: 'transferencia', label: 'Transferencia' }]} placeholder="Seleccionar método" required />
        <TextareaField label="Notas" value={textarea} onChange={setTextarea} placeholder="Observaciones adicionales..." rows={3} />
        <CheckboxField label="Acepto los términos y condiciones" checked={check} onChange={setCheck} />
      </div>
    );
  },
};

export const ConErrores: Story = {
  name: 'Con errores de validación',
  render: () => (
    <div className="w-full max-w-xs space-y-5">
      <InputField label="Email" value="invalido@" onChange={() => {}} error="El formato del email no es válido." />
      <CurrencyField label="Valor" value={0} onChange={() => {}} error="El valor debe ser mayor a 0." />
      <SelectField label="País" value="" onChange={() => {}} options={[{ value: 'co', label: 'Colombia' }]} error="Debes seleccionar un país." />
    </div>
  ),
};

export const Deshabilitados: Story = {
  name: 'Campos deshabilitados',
  render: () => (
    <div className="w-full max-w-xs space-y-5">
      <InputField label="NIT" value="900123456-1" onChange={() => {}} disabled helpText="No editable en modo vista." />
      <CurrencyField label="Total" value={1500000} onChange={() => {}} disabled />
    </div>
  ),
};
