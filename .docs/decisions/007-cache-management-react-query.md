# ADR 007: Gestión de Estado Global y Caché con React Query

## Estado
**Aceptado**

## Contexto y Problema
En la versión anterior, los hooks de datos (`useClients`, `useBill`, `useProduct`, etc.) utilizaban `useState` y `useEffect` local. Esto causaba los siguientes problemas:
1. **Pérdida de Estado**: Al navegar de la tabla a una página de creación (vía `navigateTo`), el componente de la tabla se desmontaba y perdía sus datos.
2. **Flicker de Skeleton**: Al volver a la tabla, el `useEffect` disparaba un nuevo fetch, forzando al usuario a ver un "Skeleton" de carga cada vez, aunque los datos no hubieran cambiado.
3. **Inconsistencia**: Si se creaba un registro en un modal, otras partes de la app no se enteraban del cambio hasta un refresco manual.

## Decisión
Migrar todos los hooks de lógica de negocio en `packages/interfaces/src/hooks/features/` a **TanStack React Query (v5)**.

### Implementación Técnica:
- **`useQuery`**: Implementado para todas las operaciones de lectura con un `staleTime` de 5 minutos. Esto permite que la navegación entre vistas sea instantánea si los datos ya están en el caché.
- **`useMutation`**: Implementado para Create, Update y Delete.
- **Invalidación Automática**: Al completar una mutación con éxito, se utiliza `queryClient.invalidateQueries` para marcar los datos antiguos como "stale" y forzar una actualización en segundo plano, manteniendo la UI sincronizada sin bloqueos.

## Consecuencias

### Positivas:
- **Navegación Fluida**: El usuario ya no ve skeletons al volver atrás o cerrar modales; la tabla aparece instantáneamente.
- **Reducción de Carga de Red**: Se evitan peticiones duplicadas e innecesarias al servidor durante la navegación frecuente.
- **Sincronización Automática**: Cualquier cambio en los datos invalida el caché global, asegurando que todas las vistas vean la información más reciente.
- **Código más Limpio**: Se eliminó la gestión manual de estados `isLoading`, `isError` y `data` en cada hook.

### Negativas:
- **Curva de Aprendizaje**: El equipo debe estar familiarizado con los conceptos de Query Keys e invalidación de caché.
- **Dependencia**: Aumenta la dependencia de `@tanstack/react-query` (aunque ya estaba presente en el proyecto).

## Hooks Migrados
- `useClients`
- `useBill`
- `useProduct`
- `useSeller`
- `useStore`
- `useListPrice`
