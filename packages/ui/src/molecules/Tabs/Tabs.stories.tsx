import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

/**
 * Sistema de pestañas basado en Radix UI Tabs.
 *
 * ### Uso
 * - `<Tabs>` : contenedor raíz (controla el valor activo)
 * - `<TabsList>` : barra de botones de pestaña
 * - `<TabsTrigger>` : botón individual de pestaña
 * - `<TabsContent>` : panel de contenido para cada pestaña
 */
const meta: Meta = {
  title: 'Molecules/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Default (3 tabs)',
  render: () => (
    <Tabs defaultValue="general" className="w-[380px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="facturacion">Facturación</TabsTrigger>
        <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-sm text-muted-foreground mt-3">Contenido General.</p>
      </TabsContent>
      <TabsContent value="facturacion">
        <p className="text-sm text-muted-foreground mt-3">Contenido Facturación.</p>
      </TabsContent>
      <TabsContent value="avanzado">
        <p className="text-sm text-muted-foreground mt-3">Contenido Avanzado.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const DosPestanas: Story = {
  name: 'Dos pestañas',
  render: () => (
    <Tabs defaultValue="activos" className="w-[280px]">
      <TabsList className="w-full">
        <TabsTrigger value="activos" className="flex-1">Activos</TabsTrigger>
        <TabsTrigger value="archivados" className="flex-1">Archivados</TabsTrigger>
      </TabsList>
      <TabsContent value="activos">
        <p className="text-sm text-muted-foreground mt-3">Registros activos.</p>
      </TabsContent>
      <TabsContent value="archivados">
        <p className="text-sm text-muted-foreground mt-3">Registros archivados.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const ConDeshabilitada: Story = {
  name: 'Con pestaña deshabilitada',
  render: () => (
    <Tabs defaultValue="clientes" className="w-[380px]">
      <TabsList>
        <TabsTrigger value="clientes">Clientes</TabsTrigger>
        <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        <TabsTrigger value="integraciones" disabled>Integraciones (pronto)</TabsTrigger>
      </TabsList>
      <TabsContent value="clientes">
        <p className="text-sm text-muted-foreground mt-3">Vista de clientes.</p>
      </TabsContent>
      <TabsContent value="proveedores">
        <p className="text-sm text-muted-foreground mt-3">Vista de proveedores.</p>
      </TabsContent>
    </Tabs>
  ),
};
