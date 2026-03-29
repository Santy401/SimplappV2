# Guía para Crear Nuevos Módulos en SimplappV2

## Flujo Completo

### 1. Planificar el Módulo

Antes de escribir código, documentar:
- Propósito del módulo
- Entidades necesarias
- Relaciones con otros módulos
- Integraciones (ej: DIAN)
- Estados/estados de UI

**Ubicación de planes:** `.docs/plans/YYYY-MM-DD-modulo-name.md`

### 2. Base de Datos (Prisma)

**Archivo:** `apps/web/prisma/schema/`

1. Agregar enums si son necesarios
2. Crear modelos con relaciones correctas
3. Asegurar relaciones inversas en otros modelos

```prisma
// Ejemplo: CreditNote
model CreditNote {
  id        String   @id @default(uuid())
  billId    String
  bill      Bill     @relation(fields: [billId], references: [id])
  // ...
}

// En Bill.model.ts asegurar la relación inversa:
creditNotes CreditNote[]
```

**Sincronizar:**
```bash
cd apps/web && npx prisma db push
npx prisma generate
```

### 3. Capa de Dominio

**Archivo:** `packages/domain/src/entities/`

Crear entidad con:
- Enums del módulo
- Interfaces TypeScript
- Constantes (ej: DIAN_REASON_CODES)

### 4. Capa de Interfaces (Repositorio + Servicio)

**Repositorio:** `packages/interfaces/src/repositories/`

**Servicio:** `packages/interfaces/src/services/`

Patrón recomendado:
1. Validaciones pre-transacción
2. Transacción atómica con `$transaction`
3. Actualizaciones incrementales (`{ increment: value }`)

### 5. Exportar en server.ts

**Archivo:** `packages/interfaces/src/server.ts`

Agregar exports:
```typescript
export * from './repositories/nuevo-modulo.repository';
export * from './services/nuevo-modulo.service';
```

### 6. API Routes

**Carpeta:** `apps/web/app/api/nuevo-modulo/`

- `route.ts` - GET, POST
- `[id]/route.ts` - GET, PUT, DELETE

**Importante:** Usar `getAuthContext` para autenticación.

### 7. Hook de React Query

**Carpeta:** `packages/interfaces/src/hooks/features/NuevoModulo/`

Patrón:
```typescript
const QUERY_KEY = ['nuevo-modulo'];

export const useNuevoModulo = () => {
  const queryClient = useQueryClient();
  
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/nuevo-modulo');
      if (!response.ok) throw new Error('Error...');
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/nuevo-modulo', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error...');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  });

  return { data, isLoading, error, createModulo: createMutation.mutateAsync };
};
```

### 8. UI - Componentes

**Columnas:** `packages/ui/src/config/NuevoModulo/columns.tsx`

**Página:** `apps/web/app/(dashboard)/[seccion]/NuevoModulo/page.tsx`

### 9. Navegación (Sidebar)

**Archivo:** `packages/ui/src/organisms/Sidebar/Sidebar.tsx`

Agregar ID en el submenu correspondiente:
```typescript
{ id: "ventas-nuevo-modulo", label: "Nuevo Módulo", icon: null }
```

**Ruta:** `apps/web/app/(dashboard)/ventas/nuevo-modulo/page.tsx`

### 10. Verificar Build

```bash
pnpm build --filter=@simplapp/interfaces
cd apps/web && npx next build
```

---

## Errores Comunes y Soluciones

### Error: Cannot read properties of undefined (reading 'findMany')

**Causa:** El cliente Prisma no tiene el modelo.

**Solución:**
1. Verificar que el modelo existe en `apps/web/prisma/schema/`
2. Regenerar: `npx prisma generate`
3. Verificar imports usan la ruta correcta al cliente Prisma generado

### Error: 401 Unauthorized en API

**Causa:** Sesión no autenticada o `getAuthContext` retornando null.

**Solución:**
- Verificar que el usuario tiene empresa asignada
- Revisar cookies de sesión

### Error: Ruta 404

**Causa:** La URL no coincide con la carpeta.

**Solución:**
- El sidebar transforma IDs: `ventas-notas-credito` → `/ventas/notas/credito`
- Crear carpeta: `apps/web/app/(dashboard)/ventas/notas/credito/`

---

## Patrones de Diseño

Ver `.interface-design/system.md` para:
- Spacing
- Colores de badges
- Patrones de modals
- Estados de carga
