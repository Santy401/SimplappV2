# Despliegue: GoDaddy + Vercel (Subdominio app.simplapp.com)

## Arquitectura de Dominios

```
simplapp.com            → Landing/Marketing (público)
app.simplapp.com        → Dashboard SPA (autenticado)
```

Ambos dominios apuntan al **mismo deployment de Vercel**. El middleware (`proxy.ts`)
decide qué contenido servir según el header `Host`.

---

## Paso 1 — Configurar Vercel

### 1.1 Importar el proyecto

1. Ve a [vercel.com](https://vercel.com) → "Add New Project"
2. Importa el repo de GitHub: `SimplappV2`
3. **Root Directory**: `apps/web` (¡importante! no la raíz del monorepo)
4. **Framework Preset**: Next.js (se detecta automáticamente)
5. Deploy

### 1.2 Agregar dominios custom

En el dashboard del proyecto en Vercel:

1. Settings → Domains
2. Agrega: `simplapp.com`
3. Agrega: `www.simplapp.com` (redirect a `simplapp.com`)
4. Agrega: `app.simplapp.com`

Vercel te mostrará los **DNS records** que necesitas configurar en GoDaddy.

---

## Paso 2 — Configurar DNS en GoDaddy

Ve a GoDaddy → DNS Management de tu dominio `simplapp.com`.

### Records a crear/modificar:

| Tipo  | Nombre | Valor                      | TTL   |
|-------|--------|----------------------------|-------|
| A     | @      | `76.76.21.21`              | 600   |
| CNAME | www    | `cname.vercel-dns.com`     | 3600  |
| CNAME | app    | `cname.vercel-dns.com`     | 3600  |

> ⚠️ Los valores exactos los da Vercel al agregar los dominios.
> Los de arriba son los valores estándar de Vercel, pero **siempre confirma** en el panel.

### Verificar propagación

Después de agregar los records, verifica con:

```bash
# Verificar que el DNS apunta correctamente
nslookup simplapp.com
nslookup app.simplapp.com
```

La propagación puede tardar entre 5 minutos y 48 horas.

---

## Paso 3 — Variables de entorno en Vercel

En Vercel → Settings → Environment Variables, agrega **todas**:

### Variables existentes
| Variable | Valor | Environments |
|---|---|---|
| `DATABASE_URL` | tu connection string | Production, Preview |
| `DIRECT_URL` | tu direct connection string | Production, Preview |
| `JWT_SECRET` | tu secret | Production, Preview |
| `JWT_REFRESH_SECRET` | tu refresh secret | Production, Preview |
| `NEXT_PUBLIC_API_URL` | `https://app.simplapp.com` | Production |

### Variables nuevas (dominios)
| Variable | Valor | Environments |
|---|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `simplapp.com` | Production |
| `COOKIE_DOMAIN` | `.simplapp.com` | Production |

> ⚠️ `COOKIE_DOMAIN` DEBE empezar con `.` (punto) para que las cookies sean
> accesibles desde ambos subdominios.

> 💡 Para **Preview** deployments, NO pongas estas variables de dominio
> (el código usa `localhost` como fallback).

---

## Paso 4 — SSL

Vercel genera certificados SSL **automáticamente** para todos tus dominios custom.
No necesitas hacer nada extra.

---

## Cómo funciona el routing en producción

### Usuario no autenticado

```
1. Visita simplapp.com
   → Middleware detecta host=simplapp.com, no es appDomain
   → No tiene token → next() → muestra landing

2. Click "Iniciar Sesión"
   → Va a simplapp.com/colombia/Login
   → Middleware: isAuthPageRoute=true, no token → next()

3. Submit login form
   → POST /api/auth/login
   → Cookies seteadas con domain=.simplapp.com
   → window.location.href = '/'
   
4. Redirigido a simplapp.com/
   → Middleware: host=simplapp.com + token válido
   → redirect → app.simplapp.com/ ✓
```

### Usuario autenticado

```
1. Visita app.simplapp.com
   → Middleware: isAppDomain=true, token válido → next()
   → (dashboard)/layout.tsx renderiza dashboard

2. Navega a "Facturación"
   → NavigationContext.navigateTo('ventas-facturacion')
   → URL: app.simplapp.com/ventas-facturacion/
   → Middleware: isDashboardRoute + token válido → rewrite('/')
   → Layout renderiza <Bills />
```

### Sesión expirada

```
1. Token expira en app.simplapp.com
   → Middleware: isDashboardRoute + token inválido
   → redirect → simplapp.com/colombia/Login?redirect=/ventas-facturacion/
```

---

## Troubleshooting

### Las cookies no funcionan entre subdominios
- Verifica que `COOKIE_DOMAIN=.simplapp.com` (con el punto inicial)
- Las cookies deben tener `secure: true` en producción (ya configurado)
- `sameSite: 'lax'` funciona para navegación normal entre subdominios

### El middleware no detecta el dominio correcto
- Verifica `NEXT_PUBLIC_ROOT_DOMAIN=simplapp.com` en Vercel env vars
- El middleware lee `request.headers.get('host')` — Vercel lo proporciona correctamente

### DNS no propaga
- Usa https://dnschecker.org para verificar propagación global
- GoDaddy puede tener "Domain Forwarding" habilitado que interfiere — desactívalo

### Redirect loop
- Limpia cookies del browser (DevTools → Application → Cookies → Clear All)
- Verifica que no haya `domain forwarding` en GoDaddy
- Verifica que Vercel tenga ambos dominios como "Primary" o "Redirect"

---

## Arquitectura visual

```
                    ┌──────────────────────┐
                    │      GoDaddy DNS     │
                    │                      │
                    │  simplapp.com → A    │
                    │  app.* → CNAME       │
                    └──────┬───────────────┘
                           │
                    ┌──────▼───────────────┐
                    │    Vercel Edge       │
                    │    (SSL auto)        │
                    └──────┬───────────────┘
                           │
                    ┌──────▼───────────────┐
                    │    proxy.ts          │
                    │    (Middleware)       │
                    │                      │
                    │  host check:         │
                    │  ├─ simplapp.com     │
                    │  │  → marketing      │
                    │  └─ app.simplapp.com │
                    │     → dashboard      │
                    └──────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
   ┌──────────▼──────────┐  ┌──────────▼──────────┐
   │  (marketing)        │  │  (dashboard)        │
   │  Landing + Auth     │  │  SPA Dashboard      │
   │  simplapp.com       │  │  app.simplapp.com   │
   └─────────────────────┘  └─────────────────────┘
```
