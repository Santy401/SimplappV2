import type { Meta, StoryObj } from '@storybook/react';
import { StatsWidget } from './StatsWidget';
import { DashboardChart } from './DashboardChart';
import { RecentActivityWidget } from './RecentActivityWidget';
import { DollarSign, TrendingUp } from 'lucide-react';
import React from 'react';

const meta: Meta = {
  title: 'Organisms/Dashboard/Widgets',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Stats: StoryObj<typeof StatsWidget> = {
  render: (args) => <div className="w-80"><StatsWidget {...args} /></div>,
  args: {
    title: "Ventas Totales",
    value: 1500000,
    type: 'currency',
    trend: 12.5,
    trendLabel: "vs. mes pasado",
    icon: DollarSign,
    iconColor: 'emerald',
  }
};

export const Chart: StoryObj<typeof DashboardChart> = {
  render: (args) => <div className="w-[800px]"><DashboardChart {...args} /></div>,
  args: {
    title: "Ventas Mensuales",
    description: "Comparativa de ingresos del primer semestre",
    data: JSON.parse(JSON.stringify([
      { name: 'Ene', total: 8500000 },
      { name: 'Feb', total: 9200000 },
      { name: 'Mar', total: 11000000 },
      { name: 'Abr', total: 10500000 },
      { name: 'May', total: 12800000 },
      { name: 'Jun', total: 15420000 },
    ])),
    icon: TrendingUp,
    type: 'area',
  }
};

export const Activity: StoryObj<typeof RecentActivityWidget> = {
  render: (args) => <div className="w-96"><RecentActivityWidget {...args} /></div>,
  args: {
    title: "Facturas Recientes",
    items: [
      { id: '1', prefix: 'FAC', number: 1024, clientName: 'Juan Pérez', total: 450000, status: 'PAID', date: new Date().toISOString() },
      { id: '2', prefix: 'FAC', number: 1025, clientName: 'Empresa ABC S.A.S', total: 1200000, status: 'TO_PAY', date: new Date().toISOString() },
    ],
    onViewAll: () => alert('Ver todas'),
  }
};
