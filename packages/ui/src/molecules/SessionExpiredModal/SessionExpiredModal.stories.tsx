import type { Meta, StoryObj } from '@storybook/react';
import { SessionExpiredModal } from './SessionExpiredModal';

const meta: Meta<typeof SessionExpiredModal> = {
  title: 'Molecules/SessionExpiredModal',
  component: SessionExpiredModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    isOpen:  { control: 'boolean' },
    onLogin: { action: 'onLogin' },
  },
};
export default meta;
type Story = StoryObj<typeof SessionExpiredModal>;

export const Visible: Story = {
  name: 'Sesión expirada',
  args: { isOpen: true, onLogin: () => {} },
};

export const Oculto: Story = {
  name: 'Oculto (isOpen=false)',
  args: { isOpen: false, onLogin: () => {} },
};
