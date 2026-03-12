import type { Meta, StoryObj } from '@storybook/react';
import { PaymentBillModal } from './PaymentBillModal';

/**
 * Modal de registro de un nuevo pago recibido.
 *
 * ### Características principales:
 * - Selección de cliente, cuenta bancaria, fecha y forma de pago
 * - Toggle entre "Pago a factura de cliente" y "Otros Ingresos"
 * - Empty state cuando no hay cliente seleccionado
 * - Tabla dinámica de facturas por cobrar del cliente
 * - Cálculo automático del total
 * - Campo de notas para impresión
 */
const meta: Meta<typeof PaymentBillModal> = {
  title: 'Molecules/PaymentBillModal',
  component: PaymentBillModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Cuándo usarlo
- Al registrar un pago recibido de un cliente por una o varias facturas
- Al registrar otros ingresos no asociados a una factura

### Props importantes
- \`bankAccounts\`: lista de cuentas bancarias de la empresa
- \`clients\`: lista de clientes disponibles para seleccionar
- \`bills\`: facturas por cobrar que pertenecen al cliente seleccionado
- \`onSubmit\`: callback con los datos del formulario al guardar
        `,
      },
    },
  },
  argTypes: {
    receiptNumber: {
      description: 'Número de recibo mostrado en el encabezado',
      control: 'number',
    },
    companyName: {
      description: 'Nombre de la empresa / compañía',
      control: 'text',
    },
    bankAccounts: {
      description: 'Cuentas bancarias disponibles',
      control: 'object',
    },
    clients: {
      description: 'Clientes disponibles para seleccionar',
      control: 'object',
    },
    bills: {
      description: 'Facturas por cobrar del cliente seleccionado',
      control: 'object',
    },
    onSubmit: { action: 'onSubmit' },
    onClose: { action: 'onClose' },
  },
};

export default meta;
type Story = StoryObj<typeof PaymentBillModal>;

// ─── Datos dummy compartidos ─────────────────────────────────────────────────

const MOCK_BANK_ACCOUNTS = [
  { id: 'acc-1', name: 'Caja general' },
  { id: 'acc-2', name: 'Bancolombia – Cta. Ahorros 4521' },
  { id: 'acc-3', name: 'Davivienda – Cta. Corriente 8832' },
];

const MOCK_CLIENTS = [
  { id: 'cli-1', name: 'Distribuciones López S.A.S' },
  { id: 'cli-2', name: 'Ferretería El Clavo Ltda.' },
  { id: 'cli-3', name: 'Supermercados Frescos S.A.' },
];

const MOCK_BILLS = [
  { id: 'bill-1', number: 1021, balance: 450_000, clientId: 'cli-1' },
  { id: 'bill-2', number: 1036, balance: 1_200_000, clientId: 'cli-1' },
  { id: 'bill-3', number: 1041, balance: 87_500, clientId: 'cli-1' },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Estado inicial — sin cliente seleccionado.
 * Muestra el empty state informativo en la sección de facturas.
 */
export const SinClienteSeleccionado: Story = {
  name: 'Sin cliente seleccionado',
  args: {
    receiptNumber: 3,
    companyName: 'Simpleapp',
    bankAccounts: MOCK_BANK_ACCOUNTS,
    clients: MOCK_CLIENTS,
    bills: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Estado por defecto cuando el modal se abre por primera vez. El banner azul le indica al usuario qué debe hacer a continuación.',
      },
    },
  },
};

/**
 * Con cliente y facturas pendientes cargadas.
 * El usuario ya eligió un cliente y el sistema trajo sus facturas por cobrar.
 */
export const ConFacturasPendientes: Story = {
  name: 'Con facturas pendientes',
  args: {
    receiptNumber: 7,
    companyName: 'Simpleapp',
    bankAccounts: MOCK_BANK_ACCOUNTS,
    clients: MOCK_CLIENTS,
    bills: MOCK_BILLS,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cuando el cliente ya fue seleccionado y tiene facturas pendientes, se muestra la tabla con número de factura, saldo e input de importe editable.',
      },
    },
  },
};

/**
 * Sin cuentas bancarias configuradas en la empresa.
 * Permite probar el comportamiento cuando la empresa no ha creado cuentas todavía.
 */
export const SinCuentasBancarias: Story = {
  name: 'Sin cuentas bancarias',
  args: {
    receiptNumber: 1,
    companyName: 'Nueva Empresa S.A.S',
    bankAccounts: [],
    clients: MOCK_CLIENTS,
    bills: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Si la empresa aún no configuró cuentas bancarias, el select aparece vacío. Ideal para mostrar el estado de onboarding incompleto.',
      },
    },
  },
};

/**
 * Sin clientes registrados.
 */
export const SinClientes: Story = {
  name: 'Sin clientes registrados',
  args: {
    receiptNumber: 2,
    companyName: 'Simpleapp',
    bankAccounts: MOCK_BANK_ACCOUNTS,
    clients: [],
    bills: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cuando la empresa aún no tiene clientes registrados, el select de cliente aparece vacío.',
      },
    },
  },
};

/**
 * Número de recibo alto — prueba el layout del header.
 */
export const NumeroReciboAlto: Story = {
  name: 'Número de recibo alto',
  args: {
    receiptNumber: 1_048,
    companyName: 'Distribuciones Pérez & Cía.',
    bankAccounts: MOCK_BANK_ACCOUNTS,
    clients: MOCK_CLIENTS,
    bills: MOCK_BILLS,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verifica que el número de recibo con muchos dígitos no rompa el layout del encabezado.',
      },
    },
  },
};
