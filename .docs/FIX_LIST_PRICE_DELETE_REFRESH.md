# Corrección: Actualización de Tabla al Eliminar Lista de Precios

## Descripción del Error
Al eliminar una lista de precios, la operación se realizaba correctamente en el servidor y aparecía el mensaje de éxito ("toast"), pero la tabla visualmente no se actualizaba para reflejar que el elemento había sido borrado. El usuario tenía que recargar la página manualmente para ver los cambios.

## Causa
El flujo de actualización estaba roto en el componente intermedio. Aunque la lógica de borrado (`useListPriceCustomers`) tenía la capacidad de ejecutar un callback `onDeleteSuccess`, este no estaba siendo conectado desde la página principal a través del hook de la tabla.

El flujo de datos estaba así:
1. **Page (`page.tsx`)**: Tenía la función `refetchTable` para recargar, pero no la pasaba.
2. **Hook Intermedio (`useListPriceTable.ts`)**: No aceptaba ni pasaba la propiedad `onDeleteSuccess`.
3. **Hook de Lógica (`useListPriceCustomers.ts`)**: Tenía el código `if (onDeleteSuccess) onDeleteSuccess()`, pero nunca recibía la función.

## Solución Implementada

### 1. Actualización del Hook Intermedio (`useListPriceTable.ts`)
Se modificó la interfaz y la función para aceptar `onDeleteSuccess` y propagarlo al hook de clientes.

```typescript
interface UseListPriceTableProps {
  // ... otros props
  onDeleteSuccess?: () => void; // Propiedad agregada
}

export const useListPriceTable = ({ onSelect, onSelectListPrice, onDeleteSuccess }: UseListPriceTableProps) => {
  // Se pasa onDeleteSuccess al hook hijo
  const { ... } = useListPriceCustomers({ onSelect, onSelectListPrice, onDeleteSuccess });
  // ...
};
```

### 2. Actualización de la Página Principal (`page.tsx`)
Se realizaron dos cambios importantes en el archivo de la página:

1.  **Reordenamiento de Lógica**: Se movió la definición de `refetchTable` y el estado `tableversion` hacia arriba, antes de llamar al hook de la tabla. Esto es necesario porque JavaScript/React necesita que la función exista antes de pasarla como argumento.
2.  **Conexión del Callback**: Se pasó `refetchTable` como el valor de `onDeleteSuccess`.

```typescript
// 1. Definir la función de recarga primero
const [tableversion, setTableversion] = useState(0);
const refetchTable = () => {
    setTableversion((prev) => prev + 1);
};

// 2. Pasarla al hook
const { columns, ... } = useListPriceTable({ 
    onSelect, 
    onSelectListPrice,
    onDeleteSuccess: refetchTable // Conexión realizada
});
```

## Resultado
Ahora, cuando el usuario confirma la eliminación:
1. Se borra el registro en la API.
2. `useListPriceCustomers` llama a `onDeleteSuccess`.
3. Esto ejecuta `refetchTable` en la página.
4. El estado `tableversion` cambia, disparando el `useEffect` que recarga los datos de la API.
5. La tabla se actualiza automáticamente sin recargar la página completa.
