import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    currentView: 'inicio',
    isMobileOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Barra lateral principal de navegación. Incluye versiones anclada y expandida por hover.',
      },
    },
  },
};
