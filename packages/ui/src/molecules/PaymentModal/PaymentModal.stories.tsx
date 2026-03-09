import type { Meta, StoryObj } from '@storybook/react';
import { PaymentModal } from './PaymentModal';

/**
 * Modal rápido de registro de pago sobre una factura específica.
 * Se abre desde la columna de acciones de la tabla de facturas.
 */
const meta: Meta<typeof PaymentModal> = {
  title: 'Molecules/PaymentModal',
  component: PaymentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Modal de overlay para registrar un pago rápido sobre una factura.
Para flujos complejos (multi-factura, otros ingresos), usa \`PaymentBillModal\`.
        `,
      },
    },
  },
  argTypes: {
    isOpen:   { control: 'boolean' },
    onClose:  { action: 'onClose' },
    onSubmit: { action: 'onSubmit' },
  },
};
export default meta;
type Story = StoryObj<typeof PaymentModal>;

const MOCK_BILL = {
  id: 'bill-1',
  clientName: 'Distribuciones López S.A.S',
  number: 'FV-1021',
  balance: 1_450_000,
};

export const Abierto: Story = {
  name: 'Modal abierto',
  args: { isOpen: true, bill: MOCK_BILL, onClose: () => {}, onSubmit: () => {} },
};

export const SinCliente: Story = {
  name: 'Sin nombre de cliente',
  args: { isOpen: true, bill: { ...MOCK_BILL, clientName: null }, onClose: () => {}, onSubmit: () => {} },
};

export const Cerrado: Story = {
  name: 'Cerrado (isOpen=false)',
  args: { isOpen: false, bill: MOCK_BILL, onClose: () => {}, onSubmit: () => {} },
};
