# Despliegue: GoDaddy + Vercel (Subdominios)

## Arquitectura de Dominios

```
simplapp.com.co          → Landing/Marketing (público)
www.simplapp.com.co      → Redirect a simplapp.com.co
app.simplapp.com.co      → Dashboard SPA (autenticado)
```

Ambos dominios apuntan al **mismo deployment de Vercel**.
El middleware (`proxy.ts`) decide qué contenido servir según el header `Host`.

---

## Paso 1 — Configurar Vercel

### 1.1 Importar el proyecto

1. Ve a [vercel.com](https://vercel.com) → "Add New Project"
2. Importa el repo de GitHub: `SimplappV2`
3. **Root Directory**: `apps/web`
4. **Framework Preset**: Next.js
5. Deploy

### 1.2 Agregar dominios custom

En Vercel → Settings → Domains:

1. `simplapp.com.co`
2. `www.simplapp.com.co` (redirect a `simplapp.com.co`)
3. `app.simplapp.com.co`

---

## Paso 2 — Configurar DNS en GoDaddy

En GoDaddy → DNS Management de `simplapp.com.co`:

| Tipo  | Nombre | Valor                      | TTL   |
|-------|--------|----------------------------|-------|
| A     | @      | `76.76.21.21`              | 600   |
| CNAME | www    | `cname.vercel-dns.com`     | 3600  |
| CNAME | app    | `cname.vercel-dns.com`     | 3600  |

> ⚠️ Confirmar los valores exactos en el panel de Vercel al agregar los dominios.

### Verificar propagación

```bash
nslookup simplapp.com.co
nslookup app.simplapp.com.co
```

Herramienta online: https://dnschecker.org

---

## Paso 3 — Variables de entorno en Vercel

### Variables obligatorias

| Variable | Valor | Environments |
|---|---|---|
| `DATABASE_URL` | connection string de Supabase/Neon | Production, Preview |
| `DIRECT_URL` | direct connection string | Production, Preview |
| `JWT_SECRET` | tu secret key | Production, Preview |
| `JWT_REFRESH_SECRET` | tu refresh secret | Production, Preview |

### Variables de dominio (solo Production)

| Variable | Valor | Nota |
|---|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `simplapp.com.co` | Sin protocolo, sin punto |
| `COOKIE_DOMAIN` | `.simplapp.com.co` | **CON** punto al inicio |
| `NEXT_PUBLIC_API_URL` | `""` (vacío) | Las APIs usan URLs relativas |

> ⚠️ **NO poner** `COOKIE_DOMAIN` ni `NEXT_PUBLIC_ROOT_DOMAIN` en **Preview**.
> En preview, el código usa defaults que funcionan con `.vercel.app`.

> ⚠️ `NEXT_PUBLIC_*` se baken en el bundle → requieren **redeploy** al cambiarlas.

---

## Paso 4 — SSL

Vercel genera certificados SSL **automáticamente** para todos los dominios custom.

---

## Flujo completo en producción

### Usuario no autenticado

```
1. Visita simplapp.com.co
   → Middleware: !appDomain, no token
   → redirect /colombia/ → muestra landing

2. Click "Iniciar Sesión"
   → simplapp.com.co/colombia/Login/
   → Middleware: isAuthPageRoute → next() → login page

3. Submit login
   → POST /api/auth/login (mismo origen)
   → Cookies con domain=.simplapp.com.co
   → window.location.href = '/'

4. simplapp.com.co/ con token
   → Middleware: !appDomain + token → redirect app.simplapp.com.co/
   
5. app.simplapp.com.co/
   → Middleware: appDomain + token → next() → dashboard ✓
```

### Navegación en el dashboard

```
1. Click "Facturación" en sidebar
   → NavigationContext.navigateTo('ventas-facturacion')
   → URL: app.simplapp.com.co/ventas-facturacion/
   → Middleware: isDashboardRoute + token → rewrite('/') 
   → Layout renderiza <Bills />
```

### Logout

```
1. Click cerrar sesión
   → POST /api/auth/logout (limpia cookies con domain)
   → window.location.href = 'https://simplapp.com.co/colombia/Login/'
   → Usuario en marketing domain ✓
```

---

## Configuración para desarrollo local

En local **NO necesitas** las variables de dominio. Todo funciona en `localhost:3000`:

```env
# .env (solo estas son necesarias en local)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="tu-secret"
JWT_REFRESH_SECRET="tu-refresh-secret"
NEXT_PUBLIC_API_URL=""
```

En localhost:
- `isAppDomain('localhost') = true` → siempre dashboard
- `marketingUrl('/path') = '/path'` → URLs relativas (mismo dominio)
- `COOKIE_DOMAIN` no seteado → cookies sin `domain` → funciona en localhost

---

## Troubleshooting

### Las cookies no funcionan entre subdominios
- `COOKIE_DOMAIN` debe ser `.simplapp.com.co` (con punto al inicio)
- Las cookies deben tener `secure: true` en producción
- Limpia TODAS las cookies del browser y prueba de nuevo

### Blank page después de login
- Verifica que `/api/auth/session` responde (F12 → Network)
- Si da redirect en vez de JSON: el middleware está atrapando APIs
- Solución: `if (pathname.startsWith('/api/')) return NextResponse.next();`

### Redirect loop
- Limpia cookies del browser
- Verifica que `NEXT_PUBLIC_ROOT_DOMAIN=simplapp.com.co` (sin protocolo)
- Verifica que no haya "Domain Forwarding" en GoDaddy

### Landing se ve en app.simplapp.com.co
- El middleware debe usar `marketingUrl()` para redirects al marketing domain
- Los redirects NO deben usar `url.pathname =` (mantiene el hostname)

### Variables NEXT_PUBLIC_* no toman efecto
- Estas variables se baken en build time
- Después de cambiarlas, hacer **Redeploy** en Vercel

---

## Arquitectura visual

```
                    ┌──────────────────────┐
                    │      GoDaddy DNS     │
                    │                      │
                    │  simplapp.com.co → A │
                    │  www → CNAME         │
                    │  app → CNAME         │
                    └──────┬───────────────┘
                           │
                    ┌──────▼───────────────┐
                    │   Vercel Edge (SSL)  │
                    └──────┬───────────────┘
                           │
                    ┌──────▼───────────────┐
                    │    proxy.ts          │
                    │    (Middleware)       │
                    │                      │
                    │  Host header:        │
                    │  ├─ simplapp.com.co  │
                    │  │  (marketing)      │
                    │  └─ app.simplapp...  │
                    │     (dashboard)      │
                    └──────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
   ┌──────────▼──────────┐  ┌──────────▼──────────┐
   │  (marketing)        │  │  (dashboard)        │
   │  + (auth)           │  │  SPA con sidebar    │
   │  Landing, Login,    │  │  + NavigationContext │
   │  Register           │  │  + ProtectedRoute   │
   │                     │  │                     │
   │  simplapp.com.co    │  │  app.simplapp.com.co│
   └─────────────────────┘  └─────────────────────┘
   
   Cookies: domain=.simplapp.com.co (compartidas)
```
