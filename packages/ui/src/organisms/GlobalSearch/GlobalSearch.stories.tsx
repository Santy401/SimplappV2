import type { Meta, StoryObj } from '@storybook/react';
import { GlobalSearch } from './GlobalSearch';

const meta: Meta<typeof GlobalSearch> = {
  title: 'Organisms/GlobalSearch',
  component: GlobalSearch,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GlobalSearch>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Search closed'),
    onSelect: (id, item) => console.log('Selected:', id, item),
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal de búsqueda global interactivo (Command Menu).',
      },
    },
  },
};
