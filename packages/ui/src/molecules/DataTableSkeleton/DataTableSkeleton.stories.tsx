import type { Meta, StoryObj } from '@storybook/react';
import { DataTableSkeleton } from './DataTableSkeleton';

const meta: Meta<typeof DataTableSkeleton> = {
  title: 'Molecules/DataTableSkeleton',
  component: DataTableSkeleton,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof DataTableSkeleton>;

export const Default: Story = { name: 'Cargando tabla' };
