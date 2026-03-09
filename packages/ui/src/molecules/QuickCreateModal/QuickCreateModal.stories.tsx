import type { Meta, StoryObj } from '@storybook/react';
import { QuickCreateModal } from './QuickCreateModal';
import { User, Package, Plus, MapPin } from 'lucide-react';
import React, { useState } from 'react';

const meta: Meta<typeof QuickCreateModal> = {
  title: 'Molecules/QuickCreateModal',
  component: QuickCreateModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    width: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    anchor: {
      control: 'select',
      options: ['center', 'bottom-right', 'bottom-left'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickCreateModal>;

// ─── Template con estado interno ──────────────────────────────────────────────

const ModalWithState = (args: any) => {
  const [open, setOpen] = useState(args.open ?? true);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-10 flex flex-col items-center gap-4 min-h-[400px]">
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-[#6C47FF] text-white rounded-lg text-sm font-semibold shadow-lg shadow-[#6C47FF]/20 hover:bg-[#5835E8] transition-all flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {args.title}
      </button>

      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-64 text-center">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Valores actuales</p>
        <pre className="text-[10px] text-left overflow-auto max-h-32 text-slate-600 dark:text-slate-300">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>

      <QuickCreateModal
        {...args}
        open={open}
        onClose={handleClose}
        values={values}
        onChange={handleChange}
        onSubmit={(vals) => {
          alert('Submit: ' + JSON.stringify(vals));
          setOpen(false);
        }}
      />
    </div>
  );
};

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Ejemplo: Crear un cliente nuevo de forma rápida.
 */
export const NuevoCliente: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Nuevo cliente',
    icon: User,
    description: 'Registra los datos básicos para facturar de inmediato.',
    fields: [
      { key: 'name', label: 'Nombre o Razón Social', type: 'text', placeholder: 'Ej: Juan Pérez', required: true, colSpan: 2 },
      { key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
      { key: 'phone', label: 'Teléfono', type: 'text', placeholder: '300 123 4567' },
      { key: 'id_type', label: 'Tipo ID', type: 'select', options: [{ label: 'CC', value: 'cc' }, { label: 'NIT', value: 'nit' }], required: true },
      { key: 'id_number', label: 'Número ID', type: 'text', placeholder: '123456789', required: true },
    ],
    onAdvanced: () => alert('Yendo al formulario completo de clientes...'),
  },
};

/**
 * Ejemplo: Crear un producto rápidamente con campos numéricos y selectores.
 */
export const NuevoProducto: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Crear producto',
    icon: Package,
    description: 'Agrega un ítem al catálogo sin salir de la factura.',
    fields: [
      { key: 'name', label: 'Nombre del producto', type: 'text', placeholder: 'Ej: Camisa Oxford', required: true, colSpan: 2 },
      { key: 'price', label: 'Precio base', type: 'number', placeholder: '0.00', required: true },
      { key: 'tax', label: 'Impuesto (%)', type: 'select', options: [{ label: '19%', value: '19' }, { label: '5%', value: '5' }, { label: 'Exento', value: '0' }], defaultValue: '19' },
      { key: 'stock', label: 'Stock inicial', type: 'number', placeholder: '0' },
      { key: 'category', label: 'Categoría', type: 'select', options: [{ label: 'Ropa', value: 'clothing' }, { label: 'Accesorios', value: 'acc' }] },
    ],
    onAdvanced: () => alert('Yendo al catálogo de productos...'),
    submitLabel: 'Guardar producto',
  },
};

/**
 * Ejemplo: Anclado a la derecha (estilo chat o widget lateral).
 */
export const AncladoDerecha: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Agregar ubicación',
    icon: MapPin,
    anchor: 'bottom-right',
    width: 'sm',
    fields: [
      { key: 'name', label: 'Nombre sede', type: 'text', placeholder: 'Sede Norte', required: true },
      { key: 'address', label: 'Dirección', type: 'textarea', placeholder: 'Calle 100 #15-30', required: true },
    ],
    submitLabel: 'Añadir',
  },
};

/**
 * Estado de carga (Loading).
 */
export const Cargando: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Guardando datos...',
    icon: User,
    isLoading: true,
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', defaultValue: 'Juan' },
    ],
  },
};
