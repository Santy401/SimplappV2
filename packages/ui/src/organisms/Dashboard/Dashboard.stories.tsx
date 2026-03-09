import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard, WidgetConfig } from './Dashboard';
import { DollarSign, Wallet, Users, BarChart3, TrendingUp, Package, PieChart } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Dashboard> = {
  title: 'Organisms/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

// ─── Mock Data Generator ─────────────────────────────────────────────────────

const getMockData = () => ({
  monthlySales: [
    { name: 'Ene', total: 8500000 },
    { name: 'Feb', total: 9200000 },
    { name: 'Mar', total: 11000000 },
    { name: 'Abr', total: 10500000 },
    { name: 'May', total: 12800000 },
    { name: 'Jun', total: 15420000 },
  ],
  categorySales: [
    { name: 'Electrónica', total: 4500000 },
    { name: 'Hogar', total: 3200000 },
    { name: 'Moda', total: 2100000 },
    { name: 'Otros', total: 1200000 },
  ],
  inventory: [
    { id: '1', name: 'MacBook Pro M3', stock: 2, minStock: 5 },
    { id: '2', name: 'iPhone 15 Case', stock: 12, minStock: 10 },
    { id: '3', name: 'Monitor 4K LG', stock: 0, minStock: 3 },
  ],
  recentBills: [
    { id: '1', prefix: 'FAC', number: 1024, clientName: 'Juan Pérez', total: 450000, status: 'PAID', date: new Date().toISOString() },
    { id: '2', prefix: 'FAC', number: 1025, clientName: 'Empresa ABC S.A.S', total: 1200000, status: 'TO_PAY', date: new Date().toISOString() },
  ]
});

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Modular: Story = {
  render: (args) => {
    const data = getMockData();
    const widgets: WidgetConfig[] = [
      { id: 'w1', type: 'stats', title: 'Ingresos Totales', props: { value: 25400000, type: 'currency', trend: 15.2, icon: DollarSign, iconColor: 'emerald' } },
      { id: 'w2', type: 'stats', title: 'Cuentas x Cobrar', props: { value: 8400000, type: 'currency', subValue: '15 facturas vencidas', icon: Wallet, iconColor: 'rose' } },
      { id: 'w3', type: 'stats', title: 'Nuevos Clientes', props: { value: 24, trend: 8.4, subValue: 'Este mes', icon: Users, iconColor: 'blue' } },
      { id: 'w4', type: 'stats', title: 'Ticket Promedio', props: { value: 125000, type: 'currency', icon: BarChart3, iconColor: 'purple' } },
      { id: 'w5', type: 'chart', title: 'Rendimiento de Ventas', colSpan: 3, props: { data: data.monthlySales, variant: 'area', icon: TrendingUp } },
      { id: 'w6', type: 'inventory', title: 'Alertas de Stock', colSpan: 1, props: { items: data.inventory } },
      { id: 'w7', type: 'chart', title: 'Ventas por Categoría', colSpan: 2, props: { data: data.categorySales, variant: 'pie', icon: PieChart } },
      { id: 'w8', type: 'activity', title: 'Movimientos Recientes', colSpan: 2, props: { items: data.recentBills } },
    ];
    return <Dashboard {...args} widgets={widgets} />;
  },
  args: {
    userName: "Alexander",
  }
};

export const Compact: Story = {
  render: (args) => {
    const data = getMockData();
    const widgets: WidgetConfig[] = [
      { id: 'c1', type: 'stats', title: 'Ventas', props: { value: 5000000, type: 'currency', icon: DollarSign } },
      { id: 'c2', type: 'chart', title: 'Tendencia', colSpan: 3, props: { data: data.monthlySales, variant: 'line', height: 200 } },
    ];
    return <Dashboard {...args} widgets={widgets} />;
  },
  args: {
    userName: "Admin",
  }
};
