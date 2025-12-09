import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    tags: ['autodocs'],
    args: {
        variant: 'primary',
        placeholder: 'Escribe Algo'
    }
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Primary: Story = {
    args: {
        variant: 'primary',
    }
}
