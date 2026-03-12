import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Organisms/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    onSearchOpen: () => console.log('Search opened'),
    onSelect: (view) => console.log(`Selected: ${view}`),
    onMobileMenuToggle: () => console.log('Mobile menu toggled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Barra superior de navegación principal. Contiene búsqueda, notificaciones, cambio de empresa y perfil.',
      },
    },
  },
};
