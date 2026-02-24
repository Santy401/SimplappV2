# Arquitectura de Routing del Dashboard (SPA)

## Contexto

Simplapp V2 usa un enfoque **SPA (Single Page Application)** para el dashboard. 
La navegación entre vistas NO genera páginas separadas — todo vive bajo el layout 
`app/(dashboard)/layout.tsx` que renderiza el contenido correcto via `NavigationContext`.

---

## Estructura de Rutas Next.js

```
app/
├── (dashboard)/          # Grupo: layout autenticado (sidebar, navbar, etc.)
│   ├── layout.tsx        # Layout principal con ProtectedRoute + NavigationContext
│   ├── page.tsx          # Página raíz "/" del dashboard (retorna null, el layout lo maneja)
│   ├── [...slug]/        # Catch-all para URLs de vistas (ej: /ventas-facturacion/)
│   │   └── page.tsx      # Retorna null — el layout maneja el render
│   └── Dashboard/
│       └── page.tsx      # Componente de la vista dashboard
│
└── (marketing)/          # Grupo: rutas públicas
    └── [country]/        # Ej: /colombia/, /us/
        └── page.tsx      # Landing page
        └── (auth)/
            └── Login/page.tsx
            └── Register/page.tsx
```

> ⚠️ **IMPORTANTE**: `(marketing)/[country]` captura cualquier segmento de URL de 1 nivel.
> Por eso rutas como `/ventas-facturacion/` conflictuarían con `[country]` si no hay middleware.

---

## Middleware (proxy.ts)

El middleware (`apps/web/proxy.ts`) es el guardián central del routing.

### Flujo de decisión

```
Request entrante
│
├── /_next, /static, *.* → next() [archivos estáticos]
│
├── /api/auth/* → next() [APIs públicas]
│
├── /*/Login, /*/Register
│   ├── con sesión → redirect '/' (dashboard)
│   └── sin sesión → next() (mostrar login)
│
├── DASHBOARD_ROUTES (/ventas-*, /inventario-*, /Dashboard, etc.)
│   ├── sin sesión → redirect '/colombia/Login?redirect=...'
│   └── con sesión → ⚡ REWRITE a '/' (URL browser se mantiene, Next.js sirve dashboard)
│
├── '/' (raíz)
│   ├── sin sesión → redirect '/colombia/' (landing)
│   └── con sesión → next() (sirve layout dashboard)
│
└── cualquier otra ruta
    └── sin sesión → redirect '/colombia/Login'
```

### ¿Por qué `rewrite` y no `next()` para dashboard routes?

Con `trailingSlash: true` en `next.config.ts`, Next.js añade `/` al final de todas las rutas.
Esto hace que `/ventas-facturacion/` sea ambigua:
- `(dashboard)/[...slug]` → match ✓
- `(marketing)/[country]` → match ✓ (más específico, **gana**)

Usando `NextResponse.rewrite(new URL('/', request.url))`:
- La URL en el browser **se mantiene** como `/ventas-facturacion/`
- Next.js **renderiza internamente** `(dashboard)/page.tsx` con su layout
- El `NavigationContext` lee la URL del browser y sincroniza `currentView`

---

## NavigationContext

Archivo: `apps/web/app/context/NavigationContext.tsx`

### Responsabilidades
1. Mantener `currentView` (string con el ID de la vista activa)
2. Sincronizar con la URL del browser (bidireccional)
3. Mantener historial de navegación

### Reglas de URL mapping

| Vista (`currentView`) | URL en browser |
|---|---|
| `'dashboard'` | `/` |
| `'inicio'` | `/` |
| `'ventas-facturacion'` | `/ventas-facturacion/` |
| `'ventas-clientes'` | `/ventas-clientes/` |
| `'inventario-bodega'` | `/inventario-bodega/` |
| cualquier otra | `/<view>/` |

### URL → State sync

```ts
// Strips trailing slash antes de leer
const cleanPath = pathname.replace(/\/$/, '');
const pathSegment = cleanPath.slice(1); // 'ventas-facturacion/' → 'ventas-facturacion'

if (pathname === '/' || pathname === '') {
  setCurrentView('dashboard'); // raíz = dashboard
  return;
}
```

---

## Render de vistas (layout.tsx)

El `renderContent()` en `AdminContent` usa un `switch(currentView)` para decidir
qué componente renderizar. El layout **no cambia de página**, solo swapea el contenido.

```ts
const renderContent = () => {
  switch (currentView) {
    case 'dashboard': return <Dashboard />;
    case 'ventas-facturacion': return <Bills ... />;
    case 'ventas-clientes': return <Clientes ... />;
    // ...
    default: return <div>NO SELECCIONADO</div>;
  }
};
```

---

## Post-Login Redirect

Archivo: `packages/interfaces/src/hooks/features/auth/use-login.ts`

```ts
// ✅ CORRECTO — redirige a la raíz del dashboard
window.location.href = '/';

// ❌ INCORRECTO — trailingSlash convierte a /dashboard/ que cae en (marketing)/[country]
window.location.href = '/dashboard';
```

---

## Resumen de archivos clave

| Archivo | Rol |
|---|---|
| `apps/web/proxy.ts` | Middleware: auth guard + routing logic con rewrite para dashboard |
| `apps/web/next.config.ts` | `trailingSlash: true` → impacta todas las rutas |
| `apps/web/app/(dashboard)/layout.tsx` | Layout principal con sidebar, navbar, ProtectedRoute |
| `apps/web/app/(dashboard)/page.tsx` | Página raíz `/` del dashboard (retorna null) |
| `apps/web/app/(dashboard)/[...slug]/page.tsx` | Catch-all (retorna null, el layout renderiza) |
| `apps/web/app/context/NavigationContext.tsx` | Estado de vista activa + sync URL↔state |
| `packages/interfaces/.../use-login.ts` | Hook de login — redirect a `/` post-auth |
