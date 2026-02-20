# 🔄 Sistema de Carga Unificado

## 📋 Problema Resuelto

### Antes ❌
```
Usuario navega a "Clientes"
    ↓
Loader de sesión aparece
    ↓
Loader de sesión desaparece
    ↓
Loader del componente "Clientes" aparece
    ↓
Doble carga visible = Mala UX
```

### Después ✅
```
Usuario navega a "Clientes"
    ↓
UN SOLO loader aparece
    ↓
Se mantiene hasta que TODO esté listo
    ↓
Desaparece suavemente
    ↓
Experiencia fluida
```

---

## 🎯 Solución Implementada

### 1. **LoadingContext** - Coordinador Central
**Ruta:** `apps/web/app/context/LoadingContext.tsx`

**Funcionalidad:**
- Coordina múltiples estados de carga
- `isGlobalLoading` - Carga de sesión/autenticación
- `isComponentLoading` - Carga de componentes individuales
- `isAnyLoading` - TRUE si cualquiera está cargando

**API:**
```typescript
const { 
  isGlobalLoading,      // Carga global (sesión)
  setGlobalLoading,     // Actualizar carga global
  isComponentLoading,   // Carga de componente
  setComponentLoading,  // Actualizar carga de componente
  isAnyLoading          // TRUE si cualquiera está cargando
} = useLoading();
```

---

### 2. **useComponentLoading** - Hook Helper
**Ruta:** `packages/interfaces/src/hooks/useComponentLoading.ts`

**Funcionalidad:**
- Hook simple para reportar estado de carga
- Limpieza automática al desmontar
- Integración transparente

**Uso:**
```typescript
function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Reportar automáticamente el estado de carga
  useComponentLoading(isLoading);
  
  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, []);
  
  return <div>Content</div>;
}
```

---

### 3. **ProtectedRoute** - Integración
**Actualizado para usar LoadingContext**

```typescript
export const ProtectedRoute = ({ children }) => {
  const { isLoading } = useSession();
  const { setGlobalLoading, isAnyLoading } = useLoading();

  // Sincronizar carga de sesión
  useEffect(() => {
    setGlobalLoading(isLoading);
  }, [isLoading, setGlobalLoading]);

  // Mostrar UN SOLO loader
  return (
    <>
      <Loading isVisible={isAnyLoading} />
      {!isLoading && children}
    </>
  );
};
```

---

## 🔄 Flujo de Carga

### Escenario 1: Carga Inicial de Sesión
```
App inicia
    ↓
isGlobalLoading = true (verificando sesión)
    ↓
isAnyLoading = true
    ↓
Loader visible
    ↓
Sesión verificada
    ↓
isGlobalLoading = false
    ↓
isAnyLoading = false
    ↓
Loader desaparece con fade-out
```

### Escenario 2: Navegación a Componente con Datos
```
Usuario navega a "Clientes"
    ↓
Componente Clientes monta
    ↓
isComponentLoading = true (fetching clientes)
    ↓
isAnyLoading = true
    ↓
Loader visible
    ↓
Datos cargados
    ↓
isComponentLoading = false
    ↓
isAnyLoading = false
    ↓
Loader desaparece con fade-out
```

### Escenario 3: Carga Simultánea (El Problema Original)
```
Sesión verificando + Componente cargando
    ↓
isGlobalLoading = true
isComponentLoading = true
    ↓
isAnyLoading = true (solo UNO importa)
    ↓
UN SOLO loader visible
    ↓
Sesión verificada (isGlobalLoading = false)
    ↓
isAnyLoading = true (componente aún cargando)
    ↓
Loader sigue visible
    ↓
Componente termina (isComponentLoading = false)
    ↓
isAnyLoading = false
    ↓
Loader desaparece
```

---

## 📦 Jerarquía de Contextos

```tsx
<SessionProvider>
  <LoadingProvider>          {/* ← Coordina cargas (ANTES de ProtectedRoute) */}
    <ProtectedRoute>
      <NavigationProvider>
        <AppStateProvider>
          <AdminContent />
        </AppStateProvider>
      </NavigationProvider>
    </ProtectedRoute>
  </LoadingProvider>
</SessionProvider>
```

**Orden importante:**
1. `SessionProvider` - Maneja autenticación
2. `LoadingProvider` - Coordina loaders (DEBE estar ANTES de ProtectedRoute)
3. `ProtectedRoute` - Verifica sesión y usa useLoading()
4. `NavigationProvider` - Maneja navegación
5. `AppStateProvider` - Estado global

---

## 🎨 Cómo Usar en Componentes

### Opción 1: Hook Automático (Recomendado)
```typescript
import { useComponentLoading } from '@hooks/useComponentLoading';

function ClientesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  
  // Reportar automáticamente
  useComponentLoading(isLoading);
  
  useEffect(() => {
    fetchClientes()
      .then(setClientes)
      .finally(() => setIsLoading(false));
  }, []);
  
  return <div>{/* Contenido */}</div>;
}
```

### Opción 2: Control Manual
```typescript
import { useLoading } from '@/app/context/LoadingContext';

function ProductosPage() {
  const { setComponentLoading } = useLoading();
  const [productos, setProductos] = useState([]);
  
  useEffect(() => {
    setComponentLoading(true);
    
    fetchProductos()
      .then(setProductos)
      .finally(() => setComponentLoading(false));
  }, []);
  
  return <div>{/* Contenido */}</div>;
}
```

### Opción 3: Con React Query
```typescript
import { useComponentLoading } from '@hooks/useComponentLoading';
import { useQuery } from '@tanstack/react-query';

function FacturasPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: fetchBills,
  });
  
  // Reportar automáticamente el estado de React Query
  useComponentLoading(isLoading);
  
  return <div>{/* Contenido */}</div>;
}
```

---

## ✅ Beneficios

### Para el Usuario
- ✅ **Un solo loader** - No hay parpadeos ni doble carga
- ✅ **Transiciones suaves** - Fade-out de 700ms
- ✅ **Experiencia consistente** - Mismo loader en toda la app

### Para el Desarrollador
- ✅ **Fácil de usar** - Un solo hook `useComponentLoading()`
- ✅ **Automático** - No necesita configuración manual
- ✅ **Centralizado** - Un solo punto de control
- ✅ **Type-safe** - TypeScript completo

---

## 🧪 Cómo Probar

### Test 1: Carga Inicial
1. Cerrar sesión
2. Iniciar sesión
3. **Resultado esperado:** Un solo loader durante la verificación

### Test 2: Navegación a Vista con Datos
1. Navegar a "Clientes"
2. Observar el loader
3. **Resultado esperado:** Un solo loader hasta que los datos carguen

### Test 3: Navegación Rápida
1. Navegar rápidamente entre vistas
2. Observar los loaders
3. **Resultado esperado:** Transiciones suaves sin parpadeos

### Test 4: Recarga de Página
1. Estar en una vista con datos
2. Recargar la página (F5)
3. **Resultado esperado:** Un solo loader que cubre sesión + datos

---

## 🐛 Troubleshooting

### Problema: Sigue apareciendo doble loader
**Solución:**
- Verificar que `LoadingProvider` esté en el layout
- Verificar que el componente use `useComponentLoading()`
- Revisar que no haya loaders custom en el componente

### Problema: El loader no desaparece
**Solución:**
- Verificar que `setComponentLoading(false)` se llame
- Revisar que no haya errores en el fetch
- Usar `.finally()` para asegurar que siempre se llame

### Problema: El loader parpadea
**Solución:**
- Verificar la duración del fade-out (700ms por defecto)
- Asegurar que `isAnyLoading` se use en lugar de `isLoading`

---

## 📊 Comparación

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Loaders visibles** | 2+ simultáneos | 1 unificado |
| **Parpadeos** | ❌ Frecuentes | ✅ Ninguno |
| **Transiciones** | ❌ Abruptas | ✅ Suaves (700ms) |
| **Complejidad** | ⚠️ Cada componente maneja su loader | ✅ Centralizado |
| **Experiencia** | ❌ Confusa | ✅ Profesional |

---

## 📝 Próximas Mejoras

### Prioridad Media
1. **Loader con progreso** - Mostrar % de carga
2. **Skeleton screens** - En lugar de loader para algunas vistas
3. **Prefetching** - Cargar datos antes de navegar

### Prioridad Baja
4. **Animaciones personalizadas** - Por tipo de carga
5. **Timeout automático** - Si la carga toma demasiado
6. **Métricas** - Trackear tiempos de carga

---

## ✨ Resumen

El sistema de carga unificado:
- **Coordina** - Múltiples estados de carga
- **Unifica** - Un solo loader visible
- **Suaviza** - Transiciones con fade-out
- **Simplifica** - Hook fácil de usar

**Estado:** ✅ IMPLEMENTADO Y LISTO PARA USAR

---

## 🔗 Archivos Relacionados

- `apps/web/app/context/LoadingContext.tsx` - Contexto principal
- `packages/interfaces/src/hooks/useComponentLoading.ts` - Hook helper
- `apps/web/app/ui/components/ProtectedRoute.tsx` - Integración
- `packages/ui/src/atoms/SessionLoader/Loading.tsx` - Componente loader
