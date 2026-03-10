'use client';

import React from 'react';
<<<<<<< HEAD
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { DashboardCard, DashboardSectionHeader, currencyFormat } from './DashboardAtoms';
import { TrendingUp, LucideIcon, BarChart3, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import { cn } from '../../utils/utils';

export type ChartVariant = 'area' | 'bar' | 'line' | 'pie';

interface ChartData {
  name: string;
  total: number;
  [key: string]: any;
}

interface DashboardChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  variant?: ChartVariant;
  icon?: LucideIcon;
  height?: number;
  color?: string;
  colors?: string[]; // Para Pie charts
  className?: string;
}

const DEFAULT_COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];

export function DashboardChart({
  title,
  description,
  data,
  variant = 'area',
  icon,
  height = 300,
  color = '#8b5cf6',
  colors = DEFAULT_COLORS,
  className
}: DashboardChartProps) {
  const chartId = React.useId().replace(/:/g, '');
  
  // Icono automático según variante si no se provee uno
  const Icon = icon || (
    variant === 'bar' ? BarChart3 : 
    variant === 'pie' ? PieIcon : 
    variant === 'line' ? LineIcon : TrendingUp
  );
=======
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { DashboardCard, DashboardSectionHeader, currencyFormat } from './DashboardAtoms';
import { TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import { cn } from '../../utils/utils';

const DEFAULT_COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];

export function DashboardChart({ title, description, data, variant = 'area', icon, height = 300, color = '#8b5cf6', colors = DEFAULT_COLORS, className }: any) {
  const chartId = React.useId().replace(/:/g, '');
  const Icon = icon || (variant === 'bar' ? BarChart3 : variant === 'pie' ? PieIcon : variant === 'line' ? LineIcon : TrendingUp);
>>>>>>> feat/rebuild-ui-components

  const renderChart = () => {
    switch (variant) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
<<<<<<< HEAD
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
              formatter={(value: any) => [currencyFormat(value), 'Valor']}
            />
            <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} barSize={24} animationDuration={1000} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: any) => [currencyFormat(value), 'Valor']} />
            <Line type="monotone" dataKey="total" stroke={color} strokeWidth={3} dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1000} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="total"
              animationDuration={1000}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
              formatter={(value: any) => [currencyFormat(value), 'Total']}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }} />
          </PieChart>
        );
      default: // Area
=======
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: any) => [currencyFormat(value), 'Valor']} />
            <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total">
              {data.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: any) => [currencyFormat(value), 'Total']} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );
      default:
>>>>>>> feat/rebuild-ui-components
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value: any) => [currencyFormat(value), 'Valor']} />
<<<<<<< HEAD
            <Area type="monotone" dataKey="total" stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#grad-${chartId})`} animationDuration={1000} />
=======
            <Area type="monotone" dataKey="total" stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#grad-${chartId})`} />
>>>>>>> feat/rebuild-ui-components
          </AreaChart>
        );
    }
  };

  return (
    <DashboardCard className={cn("flex flex-col h-full", className)}>
      <DashboardSectionHeader title={title} description={description} icon={Icon} />
      <div style={{ height }} className="w-full mt-auto">
<<<<<<< HEAD
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
=======
        <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>
>>>>>>> feat/rebuild-ui-components
      </div>
    </DashboardCard>
  );
}
