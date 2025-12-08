# Guía de Implementación: Monorepo, Storybook y Atomic Design

Esta guía detalla los pasos para transformar el proyecto actual en un **Monorepo** utilizando `pnpm workspaces`, implementar un sistema de diseño basado en **Atomic Design** y documentarlo con **Storybook**.

## 1. Estructura del Monorepo

El objetivo es separar la aplicación principal de la lógica de interfaz de usuario (UI) y configuraciones compartidas.

### Estructura Propuesta
```
.
├── apps/
│   └── web/                 # Tu aplicación Next.js actual (lo que está en la raíz ahora)
├── packages/
│   ├── ui/                  # Librería de componentes (Atomic Design + Storybook)
│   ├── config/              # Configuraciones compartidas (ESLint, TSConfig, Tailwind)
│   └── utils/               # (Opcional) Funciones de utilidad compartidas
├── pnpm-workspace.yaml      # Configuración del workspace
└── package.json             # Root package.json
```

### Paso 1.1: Inicialización del Workspace
1.  Crea el archivo `pnpm-workspace.yaml` en la raíz:
    ```yaml
    packages:
      - "apps/*"
      - "packages/*"
    ```
2.  Mueve todo el código de tu aplicación actual (app, public, etc.) a una nueva carpeta `apps/web`.

## 2. Creación del Paquete de UI (Atomic Design)

Crearemos un paquete dedicado para los componentes visuales siguiendo la metodología Atomic Design.

### Paso 2.1: Inicializar `packages/ui`
Dentro de `packages/ui`, inicializa un `package.json`:
```json
{
  "name": "@simplapp/ui",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Paso 2.2: Estructura de Carpetas (Atomic Design)
Organiza `packages/ui/src` de la siguiente manera:

```
packages/ui/src/
├── atoms/          # Componentes indivisibles (Button, Input, Icon, Typography)
├── molecules/      # Grupos de átomos (FormField, SearchBar, UserCard)
├── organisms/      # Secciones complejas (Header, Footer, LoginForm)
├── templates/      # Estructuras de página sin contenido real
└── index.ts        # Archivo de barril para exportar todo
```

### Ejemplo: Implementando un Átomo (Button)
`packages/ui/src/atoms/Button/Button.tsx`:
```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};
```

## 3. Configuración de Storybook

Storybook servirá como el entorno de desarrollo y documentación para tus componentes UI.

### Paso 3.1: Instalación
Ejecuta el siguiente comando dentro de `packages/ui`:
```bash
npx storybook@latest init
```
Selecciona "React" y "Vite" (o Webpack) como builder. Esto generará la carpeta `.storybook`.

### Paso 3.2: Configuración de Historias
Asegúrate de que `packages/ui/.storybook/main.ts` busque las historias en tu estructura:
```ts
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};
export default config;
```

### Paso 3.3: Creando una Historia para el Átomo Button
`packages/ui/src/atoms/Button/Button.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click Me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
};
```

## 4. Integración en la App Principal

Finalmente, conecta tu librería de UI con la aplicación Next.js.

1.  En `apps/web/package.json`, agrega la dependencia:
    ```json
    "dependencies": {
      "@simplapp/ui": "workspace:*"
    }
    ```
2.  Instala las dependencias desde la raíz del monorepo:
    ```bash
    pnpm install
    ```
3.  Usa los componentes en tus páginas:
    ```tsx
    import { Button } from '@simplapp/ui';

    export default function Page() {
      return <Button variant="primary">Hola Monorepo</Button>;
    }
    ```

## 5. Resumen de Comandos Útiles

- **Iniciar Storybook**: `pnpm --filter @simplapp/ui storybook`
- **Iniciar App Web**: `pnpm --filter web dev` (asumiendo que el name en package.json de web es "web")
- **Construir todo**: `pnpm -r build`

---
**Siguientes Pasos Recomendados:**
1.  Mover configuraciones de Tailwind a `packages/config` para compartir el tema entre la App y Storybook.
2.  Configurar TypeScript paths para importaciones más limpias.
3.  Migrar componentes existentes de `apps/web/components` a `packages/ui` refactorizándolos como átomos o moléculas.
