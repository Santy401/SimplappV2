import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { PlusIcon } from 'lucide-react'

/**
 * Botón reutilizable con múltiples variantes, tamaños y estados.
 * 
 * ### Características principales:
 * - Soporte para diferentes variantes (default, destructive, outline, etc.)
 * - Múltiples tamaños (default, sm, lg, icon)
 * - Estados (disabled, loading)
 * - Soporte para iconos
 * - Totalmente accesible
 */
const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs', 'autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
### Cuándo usarlo
- Para acciones principales, secundarias o terciarias
- Para navegación
- Para activar formularios

### Cuándo no usarlo
- Para acciones destructivas (usar \`variant="destructive"\` en su lugar)
- Para navegación entre páginas (usar el componente \`Link\` de Next.js)
        `,
            },
        },
    },
    argTypes: {
        variant: {
            description: 'Estilo visual del botón',
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        size: {
            description: 'Tamaño del botón',
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        background: {
            description: 'Color de fondo personalizado',
            control: 'color',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            }
        },
        children: {
            description: 'Contenido del botón',
            control: 'text',
        },
        disabled: {
            description: 'Estado deshabilitado',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false },
            },
        },
        asChild: {
            description: 'Renderizar como elemento hijo',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Botón principal para acciones primarias.
 * Se recomienda usar para la acción principal en una pantalla o formulario.
 */
export const Primary: Story = {
    args: {
        variant: 'default',
        children: 'Guardar cambios',
        className: 'min-w-[120px]',
    },
    parameters: {
        docs: {
            description: {
                story: 'El botón principal debe usarse para la acción más importante en una pantalla.'
            }
        }
    }
};

/**
 * Botón secundario para acciones menos importantes.
 */
export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Cancelar',
    },
    parameters: {
        docs: {
            description: {
                story: 'Ideal para acciones secundarias o como acompañante del botón principal.'
            }
        }
    }
};

/**
 * Botón con estado de peligro.
 */
export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Eliminar',
    },
    parameters: {
        docs: {
            description: {
                story: 'Usar para acciones destructivas como eliminar o deshacer cambios permanentes.'
            }
        }
    }
};

/**
 * Botón con ícono.
 */
export const WithIcon: Story = {
    args: {
        children: (
            <>
                <PlusIcon className="mr-2 h-4 w-4" />
                Nuevo elemento
            </>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: 'Puedes incluir íconos junto al texto para mayor claridad.'
            }
        }
    }
};
