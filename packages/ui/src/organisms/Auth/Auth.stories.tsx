import type { Meta, StoryObj } from '@storybook/react';
import { AuthLayout } from './AuthLayout';
import { AuthForm } from './AuthForm';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Organisms/Auth',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const FullExperience: StoryObj = {
  render: () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: any) => {
      setIsLoading(true);
      setError(null);
      console.log('Auth data:', data);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (data.email === 'error@test.com') {
        setError('Las credenciales ingresadas no son válidas.');
      } else {
        alert('Autenticación exitosa!');
      }
      setIsLoading(false);
    };

    return (
      <AuthLayout backHref="/">
        <AuthForm 
          mode={mode} 
          onModeChange={setMode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          register={() => ({ onChange: () => {} })}
        />
      </AuthLayout>
    );
  }
};

export const LoginFormOnly: StoryObj<typeof AuthForm> = {
  render: (args) => (
    <div className="bg-slate-50 p-12 min-h-screen flex items-center justify-center">
      <AuthForm {...args} />
    </div>
  ),
  args: {
    mode: 'login',
    isLoading: false,
    onModeChange: (mode) => console.log('Change to:', mode),
    onSubmit: async (data) => console.log('Submit:', data),
    register: () => ({ onChange: () => {} }),
  }
};

export const RegisterFormOnly: StoryObj<typeof AuthForm> = {
  render: (args) => (
    <div className="bg-slate-50 p-12 min-h-screen flex items-center justify-center">
      <AuthForm {...args} />
    </div>
  ),
  args: {
    mode: 'register',
    isLoading: false,
    onModeChange: (mode) => console.log('Change to:', mode),
    onSubmit: async (data) => console.log('Submit:', data),
    register: () => ({ onChange: () => {} }),
  }
};

export const LoadingState: StoryObj<typeof AuthForm> = {
  render: (args) => (
    <div className="bg-slate-50 p-12 min-h-screen flex items-center justify-center">
      <AuthForm {...args} />
    </div>
  ),
  args: {
    ...LoginFormOnly.args,
    isLoading: true,
  }
};
