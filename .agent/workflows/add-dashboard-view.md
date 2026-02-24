---
description: Checklist para agregar una nueva vista al dashboard SPA
---

# Cómo agregar una nueva vista al dashboard

El dashboard de Simplapp es una SPA. Las vistas NO son páginas Next.js independientes —
se registran en el `NavigationContext` + `layout.tsx` y el middleware las protege.

> 📖 Ver `.doc/ARQUITECTURA_ROUTING.md` para entender el sistema completo.

---

## Checklist de implementación

### 1. Crear el componente de la vista

Crea el componente dentro de `apps/web/app/(dashboard)/`:

```
apps/web/app/(dashboard)/
└── Sales/                    # o la categoría que corresponda
    └── MiNuevaVista/
        └── page.tsx          # El componente React de la vista
```

El componente puede recibir props como `onSelect`, `onSelectItem`, etc. según necesite.

### 2. Definir el ID de la vista

Elige un ID único para la vista siguiendo la convención de nomenclatura:

| Categoría | Patrón de ID | Ejemplos |
|---|---|---|
| Ventas | `ventas-<nombre>` | `ventas-facturacion`, `ventas-clientes` |
| Inventario | `inventario-<nombre>` | `inventario-bodega`, `inventario-precios` |
| Sub-vista crear | `<parent>-create` | `ventas-clientes-create` |
| Sub-vista editar | `<parent>-edit` | `ventas-clientes-edit` |

### 3. Registrar el case en `renderContent()` (layout.tsx)

Archivo: `apps/web/app/(dashboard)/layout.tsx`

```ts
case 'ventas-mivista':
  return <MiNuevaVista onSelect={navigateTo} onSelectItem={setSelectedItem} />;
case 'ventas-mivista-create':
  return <CreateMiVista onBack={() => navigateTo('ventas-mivista')} />;
```

También importa el componente al inicio del archivo:
```ts
import MiNuevaVista from './Sales/MiNuevaVista/page';
```

### 4. Registrar el item en `Breadcrumb.tsx`

Archivo: `apps/web/app/(dashboard)/Breadcrumb.tsx`

Agrega el item al array `SIDEBAR_ITEMS`:
```ts
{ id: "ventas-mivista", label: "Mi Nueva Vista", parentId: "ventas" },
{ id: "ventas-mivista-create", label: "Crear Item", parentId: "ventas-mivista" },
```

### 5. Registrar la ruta en el middleware (proxy.ts) — solo si el prefijo es nuevo

Archivo: `apps/web/proxy.ts`

Si el prefijo de la URL **ya existe** en `DASHBOARD_ROUTES` (ej: `/ventas-`), **no hay que tocar nada**.

Solo agregar si es un prefijo completamente nuevo:
```ts
const DASHBOARD_ROUTES = [
  '/Dashboard',
  '/dashboard',
  '/ventas-',        // cubre todas las rutas /ventas-*/
  '/inventario-',    // cubre todas las rutas /inventario-*/
  '/profile-settings',
  '/Onboarding',
  '/Settings',
  '/mi-nueva-categoria-', // ← SOLO si es un prefijo nuevo
];
```

> ⚠️ El middleware hace `rewrite → '/'` para todas las rutas de dashboard.
> Esto es necesario para evitar el conflicto con `(marketing)/[country]`.

### 6. Agregar al Sidebar (packages/ui)

Archivo: `packages/ui/src/components/Sidebar/` (componente del sidebar)

Agrega el item de navegación al sidebar para que aparezca en el menú.
Usa el mismo ID definido en el paso 2.

### 7. Manejar estado si la vista lo necesita (AppStateContext)

Si la vista necesita guardar un item seleccionado (para edición), registrarlo en:

Archivo: `apps/web/app/context/AppStateContext.tsx`

```ts
const [selectedMiItem, setSelectedMiItem] = useState<MiItemType | null>(null);
// Exponer en el context
```

---

## ⚠️ Reglas importantes

1. **No crear `page.tsx` fuera de `(dashboard)/[...slug]`** para rutas del dashboard.
   Las vistas viven dentro del `switch(currentView)` del layout, no como páginas independientes.

2. **IDs del sidebar deben coincidir exactamente** con los cases de `renderContent()` y
   con los IDs de `SIDEBAR_ITEMS` en el breadcrumb.

3. **No redirigir a rutas del dashboard usando `router.push('/ventas-algo')`** desde fuera
   del dashboard — en su lugar, usar `window.location.href = '/'` y dejar que el
   `NavigationContext` lo maneje, o usar `navigateTo('ventas-algo')` desde dentro.

4. **Los prefijos de URL** deben estar registrados en `DASHBOARD_ROUTES` en el middleware
   para que el guard de autenticación funcione y el rewrite ocurra correctamente.

5. **Con `trailingSlash: true`** en next.config.ts, TODAS las rutas terminan con `/`.
   El `NavigationContext` ya limpia el trailing slash al sincronizar el estado.

---

## Ejemplo rápido completo

Para agregar la vista "Reportes" con ID `ventas-reportes`:

```
1. Crear:    app/(dashboard)/Sales/Reports/page.tsx
2. ID:       'ventas-reportes'
3. layout:   case 'ventas-reportes': return <Reports onSelect={navigateTo} />;
4. Breadcrumb: { id: "ventas-reportes", label: "Reportes", parentId: "ventas" }
5. middleware: ya cubierto por '/ventas-' ✓
6. Sidebar:  agregar item con id='ventas-reportes'
```
