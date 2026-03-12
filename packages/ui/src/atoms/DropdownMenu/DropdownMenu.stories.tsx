import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './dropdown-menu';
import { Button } from '../Button/Button';
import { Settings, User, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';

/**
 * DropdownMenu accesible basado en Radix UI.
 *
 * ### Anatomía mínima
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild><Button>Abrir</Button></DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Acción</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const meta: Meta = {
  title: 'Atoms/DropdownMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Sistema completo de menús desplegables. Soporta ítems simples, checkboxes,
radio groups, separadores, submenús y atajos de teclado.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basico: Story = {
  name: 'Básico',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Abrir menú</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><User className="mr-2 size-4" />Perfil</DropdownMenuItem>
        <DropdownMenuItem><Settings className="mr-2 size-4" />Configuración</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><LogOut className="mr-2 size-4" />Cerrar sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ConAtajos: Story = {
  name: 'Con atajos de teclado',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Archivo</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem><Plus className="mr-2 size-4" />Nuevo<DropdownMenuShortcut>⌘N</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem>Abrir<DropdownMenuShortcut>⌘O</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Guardar<DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ConCheckboxes: Story = {
  name: 'Con checkboxes',
  render: () => {
    const [estado, setEstado] = useState({ activos: true, archivados: false });
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline">Filtrar vista</Button></DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Mostrar</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={estado.activos} onCheckedChange={(v) => setEstado(s => ({ ...s, activos: v }))}>
            Registros activos
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={estado.archivados} onCheckedChange={(v) => setEstado(s => ({ ...s, archivados: v }))}>
            Archivados
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const ConSubMenu: Story = {
  name: 'Con submenú',
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Más opciones</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>Ver</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Exportar</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>Excel</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
