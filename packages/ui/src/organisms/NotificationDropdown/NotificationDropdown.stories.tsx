import type { Meta, StoryObj } from '@storybook/react';
import { NotificationDropdown } from './NotificationDropdown';

const meta: Meta<typeof NotificationDropdown> = {
  title: 'Organisms/NotificationDropdown',
  component: NotificationDropdown,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationDropdown>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Panel de notificaciones con sistema de tabs y estados interactivos.',
      },
    },
  },
};
