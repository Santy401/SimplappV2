---
description: Guía y estructura para mantener la lógica de Rutas, Proxys y Autenticación en Simplapp V2
---

# Mantenimiento de la Arquitectura de Autenticación y Rutas (Proxy)

Este documento detalla cómo mantener, escalar y agregar nuevas rutas al sistema de proxy, autenticación cruzada de subdominios y el flujo de los usuarios (login, registro, onboarding, dashboard).

---

## 1. Arquitectura de Dominios (Subdominios Cruzados)

Simplapp opera resolviendo dos entornos virtuales bajo un mismo proyecto Next.js, separados conceptualmente por el hostname:
1. **Dominio de Marketing (`simplapp.com.co`)**: Renderiza landing pages, vistas públicas (como `/colombia/`, `/colombia/Login`, `/colombia/Register`).
2. **Dominio de la App (`app.simplapp.com.co` o `localhost:3000`)**: Renderiza el dashboard (SPA protegida), configuraciones, y el flujo de `Onboarding`.

### ¿Por qué existe `proxy.ts`?
En producción, las cookies (como los JWT) pueden viajar entre `simplapp.com.co` y `app.simplapp.com.co` porque configuramos el `cookieDomain` apropiadamente. Sin embargo, **Next.js App Router no tiene soporte nativo perfecto para "enrutamiento multi-téner"**.
El `proxy.ts` hace el trabajo de interceptar todas las peticiones al servidor e imponer reglas para dictaminar:
* "Si el usuario pide una vista del dashboard en el marketing, muévelo a la app".
* "Si pide login en la app, muévelo al marketing".

---

## 2. Agregar Nuevas Rutas / Vistas Protegidas (Dashboard)

El dashboard opera sobre un esquema SPA montado en el layout de `(dashboard)`. Todas las vistas del dashboard en realidad comparten un mismo "entrypoint" (casi siempre interceptado a `/` para `app.simplapp.com.co`).

### Paso 1: Actualizar `proxy.ts`
Las rutas que consideres "Protegidas" (que solo pueden verse si el usuario es válido) están mapeadas estáticamente en un array dentro de `proxy.ts`. Si vas al archivo `apps/web/proxy.ts`, debes localizar el siguiente bloque de código:

```typescript
// ─── Rutas protegidas del dashboard ──────────────────────────────────────────
const DASHBOARD_ROUTES = [
  '/Dashboard',
  '/dashboard',
  '/ventas-',
  '/inventario-',
  '/profile-settings',
  '/Settings',
  // ↓ AGREGAR TU NUEVA RUTA AQUÍ ↓
  '/soporte-', 
  '/estadisticas'
];
```

* **Criterio importante**: El proxy usa una validación tipo `startsWith()` (`pathname.startsWith(route)`). Significa que si añades `'/ventas-'`, cualquier ruta que empiece con esa cadena (ej. `/ventas-historial`, `/ventas-crear`) estará protegida.

### Paso 2: Crear el Entorno Cliente (Front-End)
* La aplicación protege frontalmente estas rutas con el contenedor `<ProtectedRoute>` (localizado en `apps/web/app/(dashboard)/ProtectedRoute.tsx`).
* Debes asegurarte de que tu página está dentro del grupo Next.js adecuado y envuelta en tus componentes de vista (`<ProtecdRoute>`).

### Paso 3: Onboarding
Recuerda que si un usuario recién creado no tiene `onboardingCompleted: true`, el componente `<ProtectedRoute>` se activará e interceptará la vista para empujarlo a `/Onboarding`. 
No agregues `/Onboarding` a lista de `DASHBOARD_ROUTES`, esto en su lugar lo maneja un condicional duro específico dentro de `proxy.ts`.

---

## 3. Manejo Correcto de Cookies y Cerrar Sesión

Las sesiones dependen fuertemente de setear y reciclar correctamente las cookies.

### El Cierre de Sesión (Logout) Inter-Dominos
Para evadir loops infinitos entre el sistema de App -> Marketing al destruir una sesión, se deben seguir dos reglas que **NO DEBES MODIFICAR** si tocas el hook de uso de `auth`:

1. **La destrucción de Cookies**: Al aniquilar una cookie, no uses `response.cookies.delete()`, en su lugar debes sobrescribir la cookie estáticamente a 0 de edad usando `set`. (Ir a `apps/web/app/api/auth/logout/route.ts`).
   ```typescript
   const cookieOptions = { path: '/', ...(cookieDomain && { domain: cookieDomain }) };
   response.cookies.set('access-token', '', { ...cookieOptions, maxAge: 0 }); // ✔️
   ```

2. **La Redirección Duro de Cliente**: Usar el router de React (`router.push()`) al intentar viajar de `app.simplapp` a `simplapp.com.co` mantendrá la memoria caché interceptada causando que Next.js reviva estados fantasma. Utiliza `window.location.href`.
   ```typescript
   // En packages/interfaces/src/hooks/useAuth.ts
   window.location.href = `https://${rootDomain}/colombia/Login/`; // ✔️ DURO
   ```

---

## 4. Peligros a Evitar: Causas Raíz de Fallos en el Proxy

Si en algún progreso a futuro el sistema comienza a generar **Er_Too_Many_Redirects (La página no está redirigiendo adecuadamente)**, revisa lo siguiente:

1. **La Regla de Exclusión de Marketing**:
   Si una nueva página pública se genera (ej: `/QuienesSomos/`), el Middleware necesita poder leerla. Actualmente el regex para atrapar marketing routes es `const isMarketingRoute = /^\/[a-zA-Z]{2,15}(\/|$)/.test(pathname)`.
   Ten mucho cuidado con estas interceptaciones agresivas. Cada caso de uso peculiar (`/Onboarding`) ha sido excluido de esa verificación del regex a mano para evadir ser tratado como ruta marketing.
   ```typescript
   // Si quitas el "!pathname.startsWith('/Onboarding')", el sistema causara Loop.
   const isMarketingRoute = /^\/[a-zA-Z]{2,15}(\/|$)/.test(pathname) && !isDashboardRoute(pathname) && !pathname.startsWith('/Onboarding'); 
   ```

2. **Refresco Invalido de Token (`auth/refresh`)**:
   El proxy omite interceptaciones de red en el scope `/api/*`. Si el API client de peticiones tira error 401, el cliente (`hooks/use-session.ts`) hace el `token refresh` automático sin recargar la pantalla y re-evalúa. Si rompes el middleware CORS que está al principio de `proxy.ts`, el token refresh del cliente React de App no podrá comunicarse de forma segura con los sockets de Marketing provocando deslogueos aleatorios misteriosos en produccion.

3. **La Ruta Raíz (`/`)**:
   La línea del `/` en proxy debe siempre mandar a `/colombia/` a los no logueados al entorno marketing, pero en local a `/colombia/Login/` estriíctamente, dado que local no emula el multi-ténant. Jamás cambies de lugar la validación `if (isLocalhost(hostname))` de dentro del Proxy de Rutas App.
