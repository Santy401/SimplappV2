import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from './Select';

/**
 * Select dropdown accesible basado en Radix UI.
 *
 * ### Anatomía
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="...">Opción</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const meta: Meta = {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Select accesible con soporte para teclado, búsqueda y agrupación de opciones.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Básico',
  render: () => (
    <Select>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Seleccionar" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="efectivo">Efectivo</SelectItem>
        <SelectItem value="transferencia">Transferencia</SelectItem>
        <SelectItem value="tarjeta">Tarjeta de crédito</SelectItem>
        <SelectItem value="cheque">Cheque</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ConGrupos: Story = {
  name: 'Con grupos de opciones',
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Seleccionar cuenta" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cuentas bancarias</SelectLabel>
          <SelectItem value="bancolombia">Bancolombia – 4521</SelectItem>
          <SelectItem value="davivienda">Davivienda – 8832</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Cajas</SelectLabel>
          <SelectItem value="caja-general">Caja general</SelectItem>
          <SelectItem value="caja-menor">Caja menor</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  name: 'Deshabilitado',
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="No disponible" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Opción A</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ConValor: Story = {
  name: 'Con valor preseleccionado',
  render: () => (
    <Select defaultValue="transferencia">
      <SelectTrigger className="w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="efectivo">Efectivo</SelectItem>
        <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
        <SelectItem value="tarjeta">Tarjeta de crédito</SelectItem>
      </SelectContent>
    </Select>
  ),
};
