import type { Meta, StoryObj } from '@storybook/react';
import { TableActionsDropdown } from './TableActionsDropdown';

const meta: Meta<typeof TableActionsDropdown> = {
  title: 'Molecules/TableActionsDropdown',
  component: TableActionsDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    onView: { action: 'onView' }, onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' }, onDuplicate: { action: 'onDuplicate' },
    onExport: { action: 'onExport' }, onArchive: { action: 'onArchive' },
    onMarkAsPaid: { action: 'onMarkAsPaid' },
  },
};
export default meta;
type Story = StoryObj<typeof TableActionsDropdown>;

export const Completo: Story = {
  name: 'Todas las acciones',
  args: { onView: () => {}, onEdit: () => {}, onDuplicate: () => {}, onExport: () => {}, onArchive: () => {}, onMarkAsPaid: () => {}, onDelete: () => {} },
};

export const MinimalReadOnly: Story = {
  name: 'Solo Ver / Editar',
  args: { onView: () => {}, onEdit: () => {} },
};

export const SoloEliminar: Story = {
  name: 'Solo Eliminar',
  args: { onDelete: () => {} },
};
