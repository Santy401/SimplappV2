import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from './Table';
import { Badge } from '../../atoms/Badge/badge';

const meta: Meta = {
  title: 'Molecules/Table',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Primitivos de tabla HTML estilizados con Tailwind. Úsalos para tablas estáticas.
Para tablas dinámicas con paginación, ordenamiento y filtros usa el componente \`DataTable\`.
      `,
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Tabla básica',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Factura</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: 'FV-1021', client: 'Distribuciones López', date: '2025-03-01', total: '$ 1.200.000', status: 'active' },
          { id: 'FV-1022', client: 'Ferretería El Clavo', date: '2025-03-03', total: '$ 340.000', status: 'default' },
          { id: 'FV-1023', client: 'Supermercados Frescos', date: '2025-03-05', total: '$ 5.870.000', status: 'destructive' },
        ].map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.client}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell className="text-right">{row.total}</TableCell>
            <TableCell>
              <Badge variant={row.status as 'active' | 'default' | 'destructive'}>
                {row.status === 'active' ? 'Pagada' : row.status === 'destructive' ? 'Vencida' : 'Pendiente'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>3 facturas encontradas</TableCaption>
    </Table>
  ),
};
