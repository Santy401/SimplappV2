# 🔄 Guía de Migración: Sistema de Carga Unificado

## 📋 Cómo Migrar Componentes Existentes

Esta guía muestra cómo actualizar componentes que tienen su propio loader para usar el sistema unificado.

---

## Ejemplo 1: Componente con useState

### ❌ ANTES (Loader Propio)
```typescript
import { useState, useEffect } from 'react';
import { Spinner } from '@ui/atoms/Spinner';

function ClientesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchClientes()
      .then(setClientes)
      .finally(() => setIsLoading(false));
  }, []);

  // ❌ Loader propio del componente
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {clientes.map(cliente => (
        <ClienteCard key={cliente.id} cliente={cliente} />
      ))}
    </div>
  );
}
```

### ✅ DESPUÉS (Sistema Unificado)
```typescript
import { useState, useEffect } from 'react';
import { useComponentLoading } from '@hooks/useComponentLoading';

function ClientesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState([]);

  // ✅ Reportar al sistema unificado
  useComponentLoading(isLoading);

  useEffect(() => {
    fetchClientes()
      .then(setClientes)
      .finally(() => setIsLoading(false));
  }, []);

  // ✅ No renderizar loader propio, el global se encarga
  return (
    <div>
      {clientes.map(cliente => (
        <ClienteCard key={cliente.id} cliente={cliente} />
      ))}
    </div>
  );
}
```

**Cambios:**
1. ✅ Agregar `useComponentLoading(isLoading)`
2. ✅ Eliminar el `if (isLoading) return <Spinner />`
3. ✅ El loader global se muestra automáticamente

---

## Ejemplo 2: Componente con React Query

### ❌ ANTES (Loader Propio)
```typescript
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@ui/atoms/Spinner';

function ProductosPage() {
  const { data: productos, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: fetchProductos,
  });

  // ❌ Loader propio
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div>
      {productos?.map(producto => (
        <ProductoCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
```

### ✅ DESPUÉS (Sistema Unificado)
```typescript
import { useQuery } from '@tanstack/react-query';
import { useComponentLoading } from '@hooks/useComponentLoading';

function ProductosPage() {
  const { data: productos, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: fetchProductos,
  });

  // ✅ Reportar al sistema unificado
  useComponentLoading(isLoading);

  // ✅ Manejar error sin loader
  if (error) {
    return <ErrorMessage error={error} />;
  }

  // ✅ No necesita verificar isLoading
  return (
    <div>
      {productos?.map(producto => (
        <ProductoCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
```

**Cambios:**
1. ✅ Agregar `useComponentLoading(isLoading)`
2. ✅ Eliminar el `if (isLoading) return <Spinner />`
3. ✅ Mantener manejo de errores

---

## Ejemplo 3: Componente con Múltiples Cargas

### ❌ ANTES (Múltiples Loaders)
```typescript
import { useState, useEffect } from 'react';
import { Spinner } from '@ui/atoms/Spinner';

function FacturaCreatePage() {
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchClientes()
      .then(setClientes)
      .finally(() => setIsLoadingClientes(false));
  }, []);

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .finally(() => setIsLoadingProductos(false));
  }, []);

  // ❌ Verificar múltiples estados
  const isLoading = isLoadingClientes || isLoadingProductos;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form>
      <ClienteSelect clientes={clientes} />
      <ProductoSelect productos={productos} />
    </form>
  );
}
```

### ✅ DESPUÉS (Sistema Unificado)
```typescript
import { useState, useEffect, useMemo } from 'react';
import { useComponentLoading } from '@hooks/useComponentLoading';

function FacturaCreatePage() {
  const [isLoadingClientes, setIsLoadingClientes] = useState(true);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  // ✅ Combinar estados de carga
  const isLoading = useMemo(
    () => isLoadingClientes || isLoadingProductos,
    [isLoadingClientes, isLoadingProductos]
  );

  // ✅ Reportar al sistema unificado
  useComponentLoading(isLoading);

  useEffect(() => {
    fetchClientes()
      .then(setClientes)
      .finally(() => setIsLoadingClientes(false));
  }, []);

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .finally(() => setIsLoadingProductos(false));
  }, []);

  // ✅ No verificar isLoading
  return (
    <form>
      <ClienteSelect clientes={clientes} />
      <ProductoSelect productos={productos} />
    </form>
  );
}
```

**Cambios:**
1. ✅ Combinar estados con `useMemo`
2. ✅ Agregar `useComponentLoading(isLoading)`
3. ✅ Eliminar verificación de `isLoading`

---

## Ejemplo 4: Componente con Control Manual

### ❌ ANTES (Loader Manual)
```typescript
import { useState } from 'react';
import { Spinner } from '@ui/atoms/Spinner';

function BillsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bills, setBills] = useState([]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBills();
      setBills(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRefresh}>Actualizar</button>
      
      {isLoading && <Spinner />}
      
      <BillsList bills={bills} />
    </div>
  );
}
```

### ✅ DESPUÉS (Sistema Unificado)
```typescript
import { useState } from 'react';
import { useComponentLoading } from '@hooks/useComponentLoading';

function BillsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bills, setBills] = useState([]);

  // ✅ Reportar al sistema unificado
  useComponentLoading(isLoading);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBills();
      setBills(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRefresh}>Actualizar</button>
      
      {/* ✅ No renderizar loader propio */}
      
      <BillsList bills={bills} />
    </div>
  );
}
```

**Cambios:**
1. ✅ Agregar `useComponentLoading(isLoading)`
2. ✅ Eliminar `{isLoading && <Spinner />}`

---

## Ejemplo 5: Componente con Skeleton (Alternativa)

A veces quieres mostrar un skeleton en lugar del loader global:

### ✅ OPCIÓN A: Loader Global
```typescript
import { useComponentLoading } from '@hooks/useComponentLoading';

function ClientesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });

  // ✅ Usar loader global
  useComponentLoading(isLoading);

  return (
    <div>
      {data?.map(cliente => (
        <ClienteCard key={cliente.id} cliente={cliente} />
      ))}
    </div>
  );
}
```

### ✅ OPCIÓN B: Skeleton Local (Sin Loader Global)
```typescript
function ClientesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });

  // ❌ NO usar useComponentLoading si quieres skeleton local

  return (
    <div>
      {isLoading ? (
        <ClientesSkeleton />
      ) : (
        data?.map(cliente => (
          <ClienteCard key={cliente.id} cliente={cliente} />
        ))
      )}
    </div>
  );
}
```

**Cuándo usar cada uno:**
- **Loader Global:** Carga inicial, navegación entre vistas
- **Skeleton Local:** Refrescar datos, paginación, búsqueda

---

## 📝 Checklist de Migración

Para cada componente:

- [ ] Identificar el estado de carga (`isLoading`, `loading`, etc.)
- [ ] Agregar `import { useComponentLoading } from '@hooks/useComponentLoading'`
- [ ] Agregar `useComponentLoading(isLoading)` después de los hooks
- [ ] Eliminar el loader propio del componente
- [ ] Eliminar imports de `Spinner`, `Loading`, etc. (si no se usan)
- [ ] Probar que el loader global aparece correctamente
- [ ] Verificar que no hay parpadeos

---

## 🎯 Componentes Prioritarios para Migrar

### Alta Prioridad (Vistas Principales)
1. ✅ `ClientesPage` - Lista de clientes
2. ✅ `ProductosPage` - Lista de productos
3. ✅ `BillsPage` - Lista de facturas
4. ✅ `VendedoresPage` - Lista de vendedores
5. ✅ `BodegaPage` - Lista de bodegas

### Media Prioridad (Formularios)
6. ✅ `CreateClient` - Crear/editar cliente
7. ✅ `CreateProduct` - Crear/editar producto
8. ✅ `FormBill` - Crear/editar factura
9. ✅ `CreateSeller` - Crear/editar vendedor
10. ✅ `CreateStore` - Crear/editar bodega

### Baja Prioridad (Otros)
11. ✅ `Dashboard` - Panel principal
12. ✅ `ListPrices` - Listas de precios

---

## 🐛 Problemas Comunes

### Problema 1: El loader no aparece
**Causa:** No se está llamando `useComponentLoading()`
**Solución:** Agregar el hook

### Problema 2: El loader no desaparece
**Causa:** `setIsLoading(false)` no se llama
**Solución:** Usar `.finally()` en las promesas

### Problema 3: Parpadeo entre loaders
**Causa:** Componente aún tiene su loader propio
**Solución:** Eliminar el loader propio completamente

### Problema 4: Error "useLoading must be used within LoadingProvider"
**Causa:** `LoadingProvider` no está en el layout
**Solución:** Verificar la jerarquía de contextos

---

## ✅ Resultado Esperado

Después de migrar todos los componentes:

- ✅ **Un solo loader** en toda la aplicación
- ✅ **Transiciones suaves** entre vistas
- ✅ **Código más limpio** sin loaders duplicados
- ✅ **Experiencia consistente** para el usuario

---

## 📊 Progreso de Migración

Usa esta tabla para trackear el progreso:

| Componente | Estado | Notas |
|------------|--------|-------|
| ClientesPage | ⏳ Pendiente | |
| ProductosPage | ⏳ Pendiente | |
| BillsPage | ⏳ Pendiente | |
| VendedoresPage | ⏳ Pendiente | |
| BodegaPage | ⏳ Pendiente | |
| CreateClient | ⏳ Pendiente | |
| CreateProduct | ⏳ Pendiente | |
| FormBill | ⏳ Pendiente | |
| CreateSeller | ⏳ Pendiente | |
| CreateStore | ⏳ Pendiente | |
| Dashboard | ⏳ Pendiente | |
| ListPrices | ⏳ Pendiente | |

**Leyenda:**
- ⏳ Pendiente
- 🔄 En progreso
- ✅ Completado
- ⚠️ Problemas

---

## 🚀 Próximo Paso

1. Identificar el componente más usado
2. Migrar ese componente primero
3. Probar exhaustivamente
4. Continuar con los demás componentes
5. Actualizar esta tabla de progreso

**Estado:** 📝 GUÍA LISTA PARA USAR
