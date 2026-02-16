# 🧭 Sistema de Navegación con Persistencia de Estado

## 📋 Resumen

Se ha implementado un sistema completo de navegación que:
- ✅ **Persiste el estado** en localStorage (sobrevive a recargas)
- ✅ **Sincroniza con la URL** (cada vista tiene su propia URL)
- ✅ **Mantiene datos de formularios** (no se pierden al navegar)
- ✅ **Historial de navegación** (botón atrás funcional)
- ✅ **Sincronización entre tabs** (cambios se reflejan en todas las pestañas)

---

## 🎯 Problema Resuelto

### Antes ❌
```
Usuario en modal de crear cliente
    ↓
Recarga la página (F5)
    ↓
Vuelve al inicio
    ↓
Pierde todo lo que escribió
```

### Después ✅
```
Usuario en modal de crear cliente
    ↓
Recarga la página (F5)
    ↓
Sigue en el modal de crear cliente
    ↓
Todos los datos siguen ahí
    ↓
URL refleja la ubicación: ?view=ventas-clientes-create
```

---

## 📦 Archivos Creados

### 1. **usePersistedState.ts** - Hook de Persistencia
**Ruta:** `packages/interfaces/src/hooks/usePersistedState.ts`

**Funcionalidades:**
- ✅ `usePersistedState<T>()` - Persiste cualquier estado en localStorage
- ✅ `useFormPersistence<T>()` - Especializado para formularios
- ✅ `useNavigationState()` - Maneja navegación y scroll
- ✅ Sincronización automática entre tabs usando `storage` event

**Ejemplo de uso:**
```typescript
// Estado simple persistido
const [count, setCount] = usePersistedState('counter', 0);

// Formulario persistido
const { values, updateValue, clearPersistedData } = useFormPersistence(
  'create-client-form',
  { name: '', email: '', phone: '' }
);
```

---

### 2. **NavigationContext.tsx** - Contexto de Navegación
**Ruta:** `apps/web/app/context/NavigationContext.tsx`

**Funcionalidades:**
- ✅ Maneja la vista actual (`currentView`)
- ✅ Sincroniza con query params de la URL (`?view=...`)
- ✅ Historial de navegación
- ✅ Función `navigateTo()` para cambiar de vista
- ✅ Función `goBack()` para volver atrás

**API:**
```typescript
const { currentView, navigateTo, goBack, navigationHistory } = useNavigation();

// Navegar a una vista
navigateTo('ventas-clientes-create');

// Volver atrás
goBack();
```

---

### 3. **AppStateContext.tsx** - Estado Global de la App
**Ruta:** `apps/web/app/context/AppStateContext.tsx`

**Funcionalidades:**
- ✅ Almacena entidades seleccionadas (Client, Product, Bill, etc.)
- ✅ Persiste automáticamente en localStorage
- ✅ Sincroniza entre tabs
- ✅ Función `clearAllSelections()` para limpiar todo

**API:**
```typescript
const {
  selectedClient,
  setSelectedClient,
  selectedBill,
  setSelectedBill,
  clearAllSelections
} = useAppState();

// Seleccionar un cliente
setSelectedClient(client);

// Limpiar todas las selecciones
clearAllSelections();
```

---

## 🔄 Flujo de Navegación

### Escenario 1: Usuario navega normalmente
```
Usuario hace clic en "Clientes" en sidebar
    ↓
navigateTo('ventas-clientes')
    ↓
currentView = 'ventas-clientes' (guardado en localStorage)
    ↓
URL actualizada: ?view=ventas-clientes
    ↓
Componente Clientes se renderiza
```

### Escenario 2: Usuario recarga la página
```
Usuario está en: ?view=ventas-clientes-create
    ↓
Recarga la página (F5)
    ↓
NavigationContext lee el query param
    ↓
currentView = 'ventas-clientes-create' (desde URL)
    ↓
AppStateContext carga selectedClient desde localStorage
    ↓
Formulario se renderiza con los datos guardados
```

### Escenario 3: Usuario abre en nueva pestaña
```
Usuario copia URL: ?view=ventas-productos-edit
    ↓
Abre en nueva pestaña
    ↓
NavigationContext lee el query param
    ↓
AppStateContext carga selectedProduct desde localStorage
    ↓
Formulario de edición se muestra con el producto correcto
```

### Escenario 4: Sincronización entre tabs
```
Tab 1: Usuario selecciona un producto
    ↓
setSelectedProduct(product) → localStorage
    ↓
storage event disparado
    ↓
Tab 2: Escucha el evento
    ↓
Tab 2: selectedProduct se actualiza automáticamente
```

---

## 🎨 Integración en el Layout

### Antes (Estado Local)
```typescript
export default function RootLayout({ children }) {
  const [currentView, setCurrentView] = useState('inicio');
  const [selectedClient, setSelectedClient] = useState(null);
  // ... más estados locales
  
  // ❌ Se pierde todo al recargar
}
```

### Después (Contextos Persistidos)
```typescript
export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <ProtectedRoute>
        <NavigationProvider>
          <AppStateProvider>
            <AdminContent>{children}</AdminContent>
          </AppStateProvider>
        </NavigationProvider>
      </ProtectedRoute>
    </SessionProvider>
  );
}

function AdminContent({ children }) {
  const { currentView, navigateTo } = useNavigation();
  const { selectedClient, setSelectedClient } = useAppState();
  
  // ✅ Todo persiste automáticamente
}
```

---

## 🔒 Datos Persistidos en localStorage

### Claves utilizadas:
```
app_current_view              → Vista actual
app_navigation_history        → Historial de navegación
app_selected_client           → Cliente seleccionado
app_selected_seller           → Vendedor seleccionado
app_selected_store            → Bodega seleccionada
app_selected_product          → Producto seleccionado
app_selected_listprice        → Lista de precios seleccionada
app_selected_bill             → Factura seleccionada
form_[formId]                 → Datos de formularios
navigation_last_route         → Última ruta visitada
navigation_scroll_positions   → Posiciones de scroll por ruta
```

---

## 🎯 Casos de Uso

### Caso 1: Crear Cliente
```
1. Usuario navega a "Clientes"
   URL: ?view=ventas-clientes

2. Hace clic en "Crear Cliente"
   URL: ?view=ventas-clientes-create
   localStorage: app_current_view = 'ventas-clientes-create'

3. Llena el formulario (nombre, email, teléfono)
   localStorage: form_create-client = { name: 'Juan', email: '...', ... }

4. Recarga la página accidentalmente
   ✅ Sigue en el formulario
   ✅ Todos los datos siguen ahí

5. Guarda el cliente
   clearPersistedData() limpia el formulario
```

### Caso 2: Editar Producto
```
1. Usuario navega a "Productos"
   URL: ?view=ventas-productos

2. Hace clic en editar un producto
   setSelectedProduct(product)
   localStorage: app_selected_product = { id: '123', name: '...', ... }
   URL: ?view=ventas-productos-edit

3. Recarga la página
   ✅ selectedProduct se carga desde localStorage
   ✅ Formulario muestra los datos del producto

4. Modifica el producto
   ✅ Cambios se guardan en localStorage automáticamente

5. Guarda los cambios
   ✅ Producto actualizado en BD
   setSelectedProduct(null) limpia la selección
```

### Caso 3: Navegación con Historial
```
1. Dashboard → Clientes → Crear Cliente → Productos
   navigationHistory: ['dashboard', 'ventas-clientes', 'ventas-clientes-create']

2. Usuario hace clic en "Atrás"
   goBack() → vuelve a 'ventas-clientes-create'

3. Usuario hace clic en "Atrás" de nuevo
   goBack() → vuelve a 'ventas-clientes'
```

---

## 🚀 Beneficios

### Para el Usuario
- ✅ **No pierde su trabajo** al recargar
- ✅ **URLs compartibles** (puede enviar el enlace exacto)
- ✅ **Botón atrás funciona** como esperado
- ✅ **Experiencia fluida** entre pestañas

### Para el Desarrollador
- ✅ **Código más limpio** (sin props drilling)
- ✅ **Estado centralizado** (fácil de debuggear)
- ✅ **Reutilizable** (hooks genéricos)
- ✅ **Type-safe** (TypeScript completo)

---

## 📊 Comparación

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Persistencia** | ❌ Se pierde al recargar | ✅ Persiste en localStorage |
| **URLs** | ❌ Siempre la misma URL | ✅ URL única por vista |
| **Compartir enlaces** | ❌ No funciona | ✅ Funciona perfectamente |
| **Botón atrás** | ❌ No funciona | ✅ Funciona con historial |
| **Formularios** | ❌ Se pierden los datos | ✅ Se guardan automáticamente |
| **Sincronización tabs** | ❌ No existe | ✅ Automática |
| **Complejidad código** | ⚠️ Props drilling | ✅ Contextos limpios |

---

## 🧪 Cómo Probar

### Test 1: Persistencia de Vista
1. Navegar a "Clientes"
2. Recargar la página (F5)
3. **Resultado esperado:** Sigue en "Clientes"

### Test 2: Persistencia de Formulario
1. Ir a "Crear Cliente"
2. Llenar nombre, email, teléfono
3. Recargar la página (F5)
4. **Resultado esperado:** Los datos siguen ahí

### Test 3: URL Sincronizada
1. Navegar a "Productos"
2. Verificar URL: `?view=ventas-productos`
3. Copiar URL y abrir en nueva pestaña
4. **Resultado esperado:** Se abre directamente en "Productos"

### Test 4: Sincronización entre Tabs
1. Abrir la app en 2 pestañas
2. En Tab 1: Seleccionar un producto para editar
3. En Tab 2: Navegar a "Productos" → "Editar"
4. **Resultado esperado:** Tab 2 muestra el mismo producto

### Test 5: Historial de Navegación
1. Dashboard → Clientes → Crear Cliente
2. Hacer clic en "Atrás" (si hay botón)
3. **Resultado esperado:** Vuelve a "Clientes"

---

## 🐛 Troubleshooting

### Problema: El estado no persiste
**Solución:** 
- Verificar que los contextos estén en el orden correcto
- Verificar que localStorage no esté deshabilitado
- Revisar la consola para errores de parsing JSON

### Problema: La URL no se actualiza
**Solución:**
- Verificar que `NavigationProvider` esté montado
- Verificar que se use `navigateTo()` en lugar de `setCurrentView()`

### Problema: Datos de formulario no se guardan
**Solución:**
- Usar `useFormPersistence()` en lugar de `useState()`
- Llamar a `updateValue()` en cada cambio de campo

### Problema: Sincronización entre tabs no funciona
**Solución:**
- Verificar que ambas tabs usen la misma clave de localStorage
- El evento `storage` solo funciona entre tabs diferentes, no en la misma tab

---

## 📝 Próximas Mejoras Sugeridas

### Prioridad Alta
1. **Migrar a rutas reales de Next.js** - En lugar de query params
2. **Agregar botón "Atrás"** visible en la UI
3. **Limpiar localStorage antiguo** - Eliminar datos de vistas que ya no existen

### Prioridad Media
4. **Expiración de datos** - Limpiar localStorage después de X días
5. **Compresión de datos** - Para formularios grandes
6. **Versionado de esquema** - Para migrar datos cuando cambia la estructura

### Prioridad Baja
7. **IndexedDB** - Para datos más grandes
8. **Service Worker** - Para sincronización offline
9. **Métricas** - Trackear qué vistas son más usadas

---

## ✨ Resumen Final

El sistema de navegación ahora:
- **Persiste todo** - Estado, formularios, selecciones
- **URLs únicas** - Cada vista tiene su propia URL
- **Sincronización** - Entre tabs y con la URL
- **Historial** - Navegación hacia atrás funcional
- **Type-safe** - TypeScript en todo el código

**Estado:** ✅ IMPLEMENTADO Y LISTO PARA TESTING
