# Guía para Implementar Nuevas Secciones en la Aplicación

Esta guía detalla el proceso paso a paso para agregar nuevas secciones a la aplicación, basándose en la implementación de Bodegas como referencia.

## Estructura de Archivos

```
apps/web/
├── app/
│   ├── api/
│   │   └── [nueva-seccion]/      # Endpoints de la API
│   │       └── route.ts
│   └── ui/
│       └── components/
│           └── Ventas/
│               └── [NuevaSeccion]/
│                   ├── config/    # Configuración de columnas, formularios, etc.
│                   └── page.tsx   # Componente principal
│
packages/
├── domain/                       # Lógica de negocio
│   └── src/
│       └── entities/             # Entidades del dominio
│           └── NuevaSeccion.entity.ts
│
└── interfaces/                   # Interfaces y adaptadores
    └── src/
        ├── config/               # Configuraciones
        │   └── [NuevaSeccion]/   # Configuración específica
        │       └── columns.tsx   # Columnas de la tabla
        └── hooks/                # Hooks personalizados
            └── features/
                └── [NuevaSeccion]/
                    ├── use[NuevaSeccion].ts      # Hook principal
                    ├── use[NuevaSeccion]Table.ts # Lógica de la tabla
                    └── index.ts                  # Exportaciones
```

## 1. Definir la Entidad de Dominio

Crea el archivo de entidad en `packages/domain/src/entities/`:

```typescript
// packages/domain/src/entities/NuevaSeccion.entity.ts
export interface NuevaSeccion {
  id: string;
  nombre: string;
  descripcion?: string;
  // Otros campos según sea necesario
  createdAt: Date;
  updatedAt: Date;
}
```

## 2. Configurar Prisma

Agrega el modelo en `apps/web/prisma/schema.prisma`:

```prisma
model NuevaSeccion {
  id          String   @id @default(uuid())
  nombre      String
  descripcion String?
  // Relaciones si son necesarias
  companyId   Int?
  company     Company? @relation(fields: [companyId], references: [id])
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 3. Crear los Hooks

### Hook Principal

```typescript
// packages/interfaces/src/hooks/features/NuevaSeccion/useNuevaSeccion.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NuevaSeccion } from '@domain/entities/NuevaSeccion.entity';

export function useNuevaSeccion() {
  const queryClient = useQueryClient();
  
  // Obtener todas las entradas
  const { data: items = [], isLoading } = useQuery<NuevaSeccion[]>({
    queryKey: ['nueva-seccion'],
    queryFn: async () => {
      const response = await fetch('/api/nueva-seccion');
      if (!response.ok) throw new Error('Error al cargar');
      return response.json();
    }
  });

  // Crear nueva entrada
  const createMutation = useMutation({
    mutationFn: async (data: Omit<NuevaSeccion, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/nueva-seccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nueva-seccion'] });
    },
  });

  // Actualizar entrada
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<NuevaSeccion> & { id: string }) => {
      const response = await fetch(`/api/nueva-seccion/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nueva-seccion'] });
    },
  });

  // Eliminar entrada
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/nueva-seccion/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nueva-seccion'] });
    },
  });

  return {
    items,
    isLoading,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
```

### Hook para la Tabla

```typescript
// packages/interfaces/src/hooks/features/NuevaSeccion/useNuevaSeccionTable.ts
import { useMemo } from 'react';
import { NuevaSeccion } from '@domain/entities/NuevaSeccion.entity';
import { ColumnDef } from '@tanstack/react-table';

export const useNuevaSeccionTable = () => {
  const columns = useMemo<ColumnDef<NuevaSeccion>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
        cell: (info) => info.getValue() || '-',
      },
      // Agregar más columnas según sea necesario
    ],
    []
  );

  return { columns };
};
```

## 4. Configurar las Columnas

```typescript
// packages/interfaces/src/config/NuevaSeccion/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { NuevaSeccion } from '@domain/entities/NuevaSeccion.entity';
import { Button } from '@simplapp/ui';

export const createColumns = (
  onEdit: (item: NuevaSeccion) => void,
  onDelete: (id: string) => void
): ColumnDef<NuevaSeccion>[] => [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
    cell: (props) => props.getValue() || '-',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original.id)}
        >
          Eliminar
        </Button>
      </div>
    ),
  },
];
```

## 5. Crear el Componente de Página

```tsx
// apps/web/app/ui/components/Ventas/NuevaSeccion/page.tsx
'use client';

import { useNuevaSeccion } from '@interfaces/src/hooks/features/NuevaSeccion/useNuevaSeccion';
import { DataTable } from '@simplapp/ui';
import { useNuevaSeccionTable } from '@interfaces/src/hooks/features/NuevaSeccion/useNuevaSeccionTable';
import { Button } from '@simplapp/ui/button';
import { useState } from 'react';
import { NuevaSeccionForm } from './components/NuevaSeccionForm';

export default function NuevaSeccionPage() {
  const { items, create, update, remove, isLoading } = useNuevaSeccion();
  const { columns } = useNuevaSeccionTable();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NuevaSeccion | null>(null);

  const handleSubmit = async (data: Omit<NuevaSeccion, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingItem) {
        await update({ ...data, id: editingItem.id });
      } else {
        await create(data);
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (item: NuevaSeccion) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      try {
        await remove(id);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Nueva Sección</h1>
          <p className="text-muted-foreground">Gestión de elementos</p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsFormOpen(true);
        }}>
          Agregar Nuevo
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        onAdd={() => {
          setEditingItem(null);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <NuevaSeccionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={editingItem}
      />
    </div>
  );
}
```

## 6. Implementar la API

### Ruta Principal

```typescript
// apps/web/app/api/nueva-seccion/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { getCurrentUser } from '@interfaces/lib/auth';

// GET /api/nueva-seccion
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.company) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const items = await prisma.nuevaSeccion.findMany({
      where: { companyId: user.company.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error al obtener elementos:', error);
    return NextResponse.json(
      { error: 'Error al obtener elementos' },
      { status: 500 }
    );
  }
}

// POST /api/nueva-seccion
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.company) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    
    const item = await prisma.nuevaSeccion.create({
      data: {
        ...data,
        companyId: user.company.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error al crear elemento:', error);
    return NextResponse.json(
      { error: 'Error al crear elemento' },
      { status: 500 }
    );
  }
}
```

### Rutas Dinámicas

```typescript
// apps/web/app/api/nueva-seccion/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { getCurrentUser } from '@interfaces/lib/auth';

// GET /api/nueva-seccion/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.company) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const item = await prisma.nuevaSeccion.findUnique({
      where: { id: params.id, companyId: user.company.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error al obtener elemento:', error);
    return NextResponse.json(
      { error: 'Error al obtener elemento' },
      { status: 500 }
    );
  }
}

// PUT /api/nueva-seccion/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.company) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    const item = await prisma.nuevaSeccion.update({
      where: { id: params.id, companyId: user.company.id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error al actualizar elemento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar elemento' },
      { status: 500 }
    );
  }
}

// DELETE /api/nueva-seccion/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.company) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.nuevaSeccion.delete({
      where: { id: params.id, companyId: user.company.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar elemento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar elemento' },
      { status: 500 }
    );
  }
}
```

## 7. Agregar al Sidebar

```tsx
// En tu archivo de navegación (ej: components/layout/Sidebar.tsx)
{
  id: 'nueva-seccion',
  label: 'Nueva Sección',
  icon: <LayoutDashboard size={20} />,
  href: '/admin/nueva-seccion',
}
```

## 8. Entendiendo los Módulos con @

Los imports que comienzan con `@` son alias de rutas configurados en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@domain/*": ["./packages/domain/src/*"],
      "@interfaces/*": ["./packages/interfaces/src/*"]
    }
  }
}
```

Esto permite importaciones más limpias:

```typescript
// En lugar de:
import { NuevaSeccion } from '../../../../../../packages/domain/src/entities/NuevaSeccion.entity';

// Puedes usar:
import { NuevaSeccion } from '@domain/entities/NuevaSeccion.entity';
```

## Consejos para el Desarrollo

### 1. Sigue el flujo de datos
- Empieza por definir la entidad de dominio
- Luego el modelo de Prisma
- Sigue con los hooks y la lógica de negocio
- Finalmente, la interfaz de usuario

### 2. Mantén la consistencia
- Usa los mismos patrones de nomenclatura
- Sigue la misma estructura de carpetas
- Mantén un estilo de código consistente

### 3. Pruebas
- Prueba cada capa por separado
- Asegúrate de manejar correctamente los errores
- Verifica los permisos y la seguridad

### 4. Documentación
- Documenta las funciones y componentes importantes
- Incluye ejemplos de uso
- Mantén actualizado el README

---

Siguiendo esta guía, podrás agregar nuevas secciones a la aplicación de manera estructurada y mantenible.