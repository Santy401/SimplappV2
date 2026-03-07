# Arquitectura de Routing del Dashboard (SPA) + Subdominios

## Resumen

Simplapp V2 usa dos dominios en producción:

| Dominio | Función | Layout Next.js |
|---|---|---|
| `simplapp.com.co` / `www.simplapp.com.co` | Landing, Login, Register (público) | `(marketing)` |
| `app.simplapp.com.co` | Dashboard SPA (autenticado) | `(dashboard)` |

Ambos apuntan al **mismo deployment en Vercel**. El middleware (`proxy.ts`) decide qué
servir según el header `Host` de cada request.

En **desarrollo local** (`localhost`), todo corre en un solo dominio y se comporta
como el app domain (dashboard).

---

## Estructura de Rutas Next.js

```
app/
├── (dashboard)/              # Grupo: layout autenticado
│   ├── layout.tsx            # Layout con ProtectedRoute + NavigationContext
│   ├── page.tsx              # Página raíz "/" (retorna null, layout renderiza)
│   ├── [...slug]/page.tsx    # Catch-all para URLs de vistas del SPA
│   ├── Dashboard/page.tsx    # Componente de vista dashboard
│   ├── Sales/                # Vistas de ventas
│   ├── Settings/             # Vistas de configuración
│   └── SettingsModal/        # Modal de settings
│
├── (marketing)/              # Grupo: rutas públicas
│   └── [country]/page.tsx    # Landing page (/colombia/, /us/, etc.)
│
├── (auth)/                   # Grupo: autenticación
│   └── [country]/
│       ├── Login/page.tsx
│       └── Register/page.tsx
│
├── Onboarding/               # Flujo de onboarding (standalone)
│   ├── page.tsx
│   └── layout.tsx
│
├── api/                      # API routes (siempre pasan sin middleware)
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── session/route.ts
│   │   ├── refresh/route.ts
│   │   └── ...
│   ├── bills/
│   ├── clients/
│   └── ...
│
└── context/                  # Contextos React
    ├── NavigationContext.tsx  # Estado de vista activa + sync URL↔state
    ├── SessionContext.tsx     # Modal de sesión expirada
    ├── AppStateContext.tsx    # Estado de items seleccionados
    ├── LoadingContext.tsx     # Estado de carga global
    └── SettingsContext.tsx    # Modal de settings
```

---

## Middleware (proxy.ts)

### Helpers de dominio

```typescript
// Determinar si es dominio de app (dashboard)
function isAppDomain(hostname): boolean {
  localhost        → true (siempre app en dev)
  *.vercel.app     → true (preview deployments)
  app.simplapp.com.co → true
  simplapp.com.co  → false (marketing)
}

// URLs absolutas para redirects cross-domain
function marketingUrl(path, hostname): string {
  localhost → '/path'  (relativo, mismo dominio)
  prod     → 'https://simplapp.com.co/path'
}

function appUrl(path, hostname): string {
  localhost → '/path'
  prod     → 'https://app.simplapp.com.co/path'
}
```

### Flujo de decisión completo

```
Request entrante
│
├── /_next, /static, *.* → next() [archivos estáticos]
│
├── /api/* → next() [TODAS las APIs, sin restricción]
│   ⚠️ Crítico: incluye /api/auth/session que ProtectedRoute necesita
│
├── DOMINIO MARKETING (simplapp.com.co)
│   ├── con sesión → redirect app.simplapp.com.co/
│   ├── /*/Login, /*/Register → next()
│   ├── / → redirect /colombia/
│   ├── /colombia/, /us/ (marketing válido) → next()
│   └── ruta desconocida → redirect /colombia/
│
└── DOMINIO APP (app.simplapp.com.co / localhost)
    ├── /*/Login, /*/Register
    │   ├── con sesión → redirect /
    │   └── sin sesión → redirect simplapp.com.co/*/Login
    │
    ├── /colombia/, /us/ (marketing en app) → redirect simplapp.com.co/*
    │
    ├── DASHBOARD_ROUTES (/ventas-*, /inventario-*, etc.)
    │   ├── sin sesión → redirect simplapp.com.co/colombia/Login
    │   └── con sesión → REWRITE a '/' (URL se mantiene)
    │
    ├── / (raíz)
    │   ├── sin sesión → redirect simplapp.com.co/colombia/
    │   └── con sesión → next() (dashboard)
    │
    └── ruta desconocida sin sesión → redirect simplapp.com.co/colombia/Login
```

### ¿Por qué `rewrite` para dashboard routes?

Con `trailingSlash: true` en `next.config.ts`, rutas como `/ventas-facturacion/`
son ambiguas entre `(dashboard)/[...slug]` y `(marketing)/[country]`.
Next.js elige `[country]` (más específico), renderizando la landing.

`NextResponse.rewrite(new URL('/', request.url))`:
- URL en browser → **se mantiene** como `/ventas-facturacion/`
- Next.js → **renderiza internamente** `(dashboard)/page.tsx` con su layout
- `NavigationContext` → lee la URL del browser y sincroniza `currentView`

### ¿Por qué `/api/*` pasa sin restricción?

La regex de marketing routes (`/^\/[a-zA-Z]{2,15}(\/|$)/`) matchea `/api/*`
porque "api" tiene 3 letras. Sin el early return para APIs, el middleware
redirige `/api/auth/session` a `/` → ProtectedRoute nunca obtiene la sesión → **blank page**.

---

## NavigationContext

Archivo: `apps/web/app/context/NavigationContext.tsx`

### URL mapping

| Vista (`currentView`) | URL en browser |
|---|---|
| `'dashboard'` | `/` |
| `'inicio'` | `/` |
| `'ventas-facturacion'` | `/ventas-facturacion/` |
| `'ventas-clientes'` | `/ventas-clientes/` |
| cualquier otra | `/<view>/` |

### URL → State sync

```typescript
// Strip trailing slash, luego extraer segment
const cleanPath = pathname.replace(/\/$/, '');
const pathSegment = cleanPath.slice(1);

if (pathname === '/' || pathname === '') {
  setCurrentView('dashboard');
} else if (pathSegment && pathSegment !== 'Onboarding') {
  setCurrentView(pathSegment);
}
```

### State → URL sync

```typescript
const path = (view === 'inicio' || view === 'dashboard') ? '/' : `/${view}`;
router.push(path, { scroll: false });
```

---

## Cookies Cross-Subdomain

Para que las cookies funcionen entre `simplapp.com.co` y `app.simplapp.com.co`:

```typescript
// En login, refresh y logout:
const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

response.cookies.set('access-token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  ...(cookieDomain && { domain: cookieDomain }),
  // domain='.simplapp.com.co' → funciona en ambos subdominios
});
```

### Variables de entorno

| Variable | Valor producción | Valor dev (no poner) |
|---|---|---|
| `COOKIE_DOMAIN` | `.simplapp.com.co` | (vacío → hostname actual) |
| `NEXT_PUBLIC_ROOT_DOMAIN` | `simplapp.com.co` | (vacío → default) |
| `NEXT_PUBLIC_API_URL` | `""` (vacío) | `""` (vacío) |

> ⚠️ `COOKIE_DOMAIN` DEBE empezar con `.` (punto) para cross-subdomain.
> ⚠️ `NEXT_PUBLIC_*` se baken en el bundle → requieren **redeploy** al cambiarlas.

---

## Post-Login / Post-Logout Redirects

### Login (`use-login.ts`)
```typescript
// ✅ Redirige a la raíz del dominio actual
window.location.href = '/';
// → En marketing: middleware detecta sesión → redirect app.simplapp.com.co
// → En app: middleware sirve dashboard
```

### Logout (`use-logout.ts`)
```typescript
// ✅ Redirige al dominio de marketing
const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
const loginUrl = rootDomain
  ? `https://${rootDomain}/colombia/Login/`
  : '/colombia/Login';
window.location.href = loginUrl;
```

---

## Render de vistas (layout.tsx)

```typescript
const renderContent = () => {
  switch (currentView) {
    case 'dashboard':          return <Dashboard />;
    case 'ventas-facturacion':  return <Bills ... />;
    case 'ventas-clientes':     return <Clientes ... />;
    // ...
    default:                    return <div>NO SELECCIONADO</div>;
  }
};
```

---

## Errores comunes y soluciones

### Blank page después de login
**Causa**: `/api/auth/session` interceptado por el middleware y redirigido.
**Fix**: `if (pathname.startsWith('/api/')) return NextResponse.next();` ANTES de cualquier check.

### Redirect loop en `/colombia/`
**Causa**: Catch-all en marketing redirige todo a `/colombia/`, incluyendo `/colombia/` misma.
**Fix**: Verificar si la ruta es marketing válida antes del catch-all.

### Landing se ve en `app.simplapp.com.co`
**Causa**: Los redirects usan `url.pathname` (relativo → mantiene hostname).
**Fix**: Usar `marketingUrl()` / `appUrl()` que generan URLs absolutas en producción.

### Cookies no funcionan cross-domain
**Causa**: `COOKIE_DOMAIN` no está seteado o tiene valor incorrecto.
**Fix**: `COOKIE_DOMAIN=.simplapp.com.co` (con punto al inicio).

---

## Archivos clave

| Archivo | Rol |
|---|---|
| `apps/web/proxy.ts` | Middleware: routing por hostname, auth guard, rewrite |
| `apps/web/next.config.ts` | `trailingSlash: true` |
| `apps/web/app/(dashboard)/layout.tsx` | Layout SPA con sidebar, navbar, ProtectedRoute |
| `apps/web/app/(dashboard)/page.tsx` | Página raíz `/` del dashboard |
| `apps/web/app/context/NavigationContext.tsx` | Estado de vista + sync URL |
| `apps/web/app/api/auth/login/route.ts` | Login API + cookies con domain |
| `apps/web/app/api/auth/logout/route.ts` | Logout API + limpieza cookies |
| `apps/web/app/api/auth/refresh/route.ts` | Refresh token + cookies con domain |
| `packages/interfaces/.../use-login.ts` | Hook login → redirect '/' |
| `packages/interfaces/.../use-logout.ts` | Hook logout → redirect marketing domain |
| `packages/interfaces/lib/api-client.ts` | Cliente API con baseURL y refresh automático |
