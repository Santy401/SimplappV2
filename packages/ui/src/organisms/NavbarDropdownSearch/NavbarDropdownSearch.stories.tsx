import type { Meta, StoryObj } from '@storybook/react';
import { NavbarDropdownSearch } from './NavbarDropdownSearch';

const meta: Meta<typeof NavbarDropdownSearch> = {
  title: 'Organisms/NavbarDropdownSearch',
  component: NavbarDropdownSearch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavbarDropdownSearch>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Buscador centralizado del Navbar con dropdown local/remoto.',
      },
    },
  },
};
