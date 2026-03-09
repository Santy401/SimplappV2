import type { Meta, StoryObj } from "@storybook/react";
import { ModernTable } from "./ModernTable";
import { TableColumn } from "../../types/table.entity";

// --- Mock Data ---
interface MockPayment {
  id: string;
  receiptNumber: string;
  clientName: string;
  method: string;
  date: string;
  amount: number;
}

const meta: Meta<typeof ModernTable<MockPayment>> = {
  title: "Molecules/ModernTable",
  component: ModernTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ModernTable<MockPayment>>;

const mockColumns: TableColumn<MockPayment>[] = [
  { key: "receiptNumber", header: "Número", className: "text-emerald-600 font-medium cursor-pointer hover:underline" },
  { key: "clientName", header: "Cliente", className: "font-medium text-slate-900 dark:text-slate-100" },
  { key: "method", header: "Método" },
  { key: "date", header: "Fecha Creación" },
  {
    key: "amount",
    header: "Monto",
    className: "text-right font-medium",
    cell: (item: MockPayment) => `$ ${item.amount.toLocaleString("es-CO")}`,
  },
];

const mockData: MockPayment[] = [
  { id: "1", receiptNumber: "REC-001", clientName: "Acme Corp", method: "Transferencia", date: "15/10/2023", amount: 1500000 },
  { id: "2", receiptNumber: "REC-002", clientName: "Global Tech", method: "Efectivo", date: "16/10/2023", amount: 450000 },
  { id: "3", receiptNumber: "REC-003", clientName: "Nuevas Ideas S.A.", method: "Tarjeta de Crédito", date: "18/10/2023", amount: 2800000 },
  { id: "4", receiptNumber: "REC-004", clientName: "Juan Pérez", method: "Otro", date: "20/10/2023", amount: 150000 },
];

export const Default: Story = {
  args: {
    title: "Pagos recibidos",
    description: "Registra y organiza todos los pagos que recibes en tu empresa.",
    columns: mockColumns,
    data: mockData,
    addActionLabel: "Nuevo pago",
    onAdd: () => alert("Nueva acción disparada"),
    searchable: true,
    pagination: true,
    itemsPerPage: 5,
  },
};

export const LoadingState: Story = {
  args: {
    title: "Lista de Facturas",
    columns: mockColumns,
    data: [],
    isLoading: true,
  },
};

export const EmptyState: Story = {
  args: {
    title: "Clientes Inactivos",
    columns: mockColumns,
    data: [],
    emptyStateMessage: "No se encontraron clientes inactivos en el sistema.",
    searchable: false,
    pagination: false,
  },
};
