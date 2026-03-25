# OPENCODE.md — Simplapp V2

**Project**: Simplapp ERP System (SaaS multi-tenant)
**Stack**: Next.js 16, TypeScript, Prisma 7, PostgreSQL 16, TanStack Query, Tailwind CSS 4, Radix UI
**Package Manager**: pnpm
**Deploy**: Vercel (app.simplapp.com.co) + Docker para desarrollo

---

## Quick Commands

```bash
pnpm dev          # Start all apps
pnpm build        # Full monorepo build
pnpm lint         # Lint all packages
pnpm check-types  # TypeScript check
```

---

## Project Structure

```
simplapp-monorepo/
├── apps/
│   ├── web/           # Next.js frontend + API routes (main app)
│   ├── api/           # Placeholder (futura API separada)
│   └── admin/         # Placeholder (futuro admin panel)
├── packages/
│   ├── ui/            # Sistema de diseño (componentes, Radix, Tailwind)
│   ├── domain/        # Entidades, tipos, esquemas Zod (sin dependencias UI)
│   ├── interfaces/    # Hooks, API client, servicios, contextos, auth
│   └── config/        # Configuraciones compartidas
├── .docs/             # Documentación técnica completa
├── .agents/           # Config de agentes IA
├── prisma/            # Esquemas modulares de base de datos
└── tools/             # Utilidades de desarrollo
```

---

## Dominio de Negocio

### Módulos

| Módulo | Entidades | Descripción |
|--------|-----------|-------------|
| **Auth** | User, RefreshToken, PasswordResetToken | JWT con double token, rate limiting |
| **Company** | Company, Subscription | Multi-tenancy, planes (FREE/PRO/ENTERPRISE) |
| **CRM** | Client, Seller | Clientes y vendedores |
| **Billing** | Bill, BillItem, Payment, BankAccount | Facturación electrónica, pagos, tesorería |
| **Inventory** | Store, Product, CategoryProduct, ProductImage, InventoryMovement, ListPrice | Inventario, productos, listas de precios |
| **System** | ActivityLog, Notification | Auditoría y notificaciones |

### Enums principales

- `UserRole`: OWNER, ADMIN, ACCOUNTANT, EMPLOYEE
- `BillStatus`: DRAFT, ISSUED, PAID, PARTIALLY_PAID, CANCELLED, TO_PAY
- `DianStatus`: PENDING, SENT, ACCEPTED, REJECTED
- `PaymentMethod`: CASH, CREDIT_CARD, DEBIT_CARD, TRANSFER, CHECK, DEPOSIT, CREDIT
- `ItemType`: PRODUCT, SERVICE, COMBO, VARIANT
- `MovementType`: IN, OUT, ADJUSTMENT, TRANSFER

---

## Patrones de Código

### Arquitectura de capas

```
UI Layer (apps/web)
    ↓
Interfaces Layer (@simplapp/interfaces)
    ├── Hooks (TanStack Query + custom)
    ├── Services (lógica de negocio)
    ├── Contexts (Session, Navigation, AppState)
    └── lib/ (Prisma, Auth helpers, API client)
    ↓
Domain Layer (@simplapp/domain)
    ├── Entities (tipos TypeScript)
    ├── Schemas (validación Zod)
    └── Utils
```

### Hooks Pattern

```typescript
// packages/interfaces/src/hooks/features/[Feature]/
├── use[Feature].ts       // CRUD principal
├── use[Feature]Table.ts   // Config de columnas para tabla
└── index.ts
```

### API Routes Pattern

```typescript
// apps/web/app/api/[resource]/route.ts
GET  → Listar con filtros y paginación
POST → Crear (companyId automático desde sesión)

// apps/web/app/api/[resource]/[id]/route.ts
GET    → Obtener uno
PUT    → Actualizar
DELETE → Eliminar (soft delete)

// apps/web/app/api/[resource]/[id]/[action]/route.ts
POST → Acciones específicas (issue, cancel, payments)
```

### Multi-tenancy

- Todas las entidades tienen `companyId`
- `companyId` se asigna automáticamente desde `getAuthContext()`
- Verificación de ownership en PUT/DELETE

---

## APIs Existentes

| Categoría | Endpoints |
|-----------|-----------|
| **Auth** | login, register, logout, refresh, session, profile, forgot-password, reset-password, verify-email, switch-company, onboarding |
| **Bills** | CRUD completo + issue, cancel, payments |
| **Clients** | CRUD completo |
| **Products** | CRUD completo |
| **Stores** | CRUD completo |
| **Sellers** | CRUD completo |
| **Payments** | CRUD completo |
| **Bank Accounts** | CRUD completo |
| **Categories** | CRUD completo |
| **List Prices** | CRUD completo |
| **DIAN** | send, status |
| **Metrics** | dashboard |
| **Search** | búsqueda global |

---

## Autenticación

| Token | Duración | Almacenamiento |
|-------|----------|-----------------|
| `access-token` | 15 min | Cookie httpOnly |
| `refresh-token` | 7 días | Cookie httpOnly + DB |

**Flujo**: Login → ambos tokens → cookies → access expira → refresh → refresh expira → re-login

---

## UI/UX

### Sistema de Diseño

- **Tailwind CSS 4** + **Radix UI** + **Framer Motion**
- **Sonner** para toasts
- **Recharts** para gráficos
- **next-themes** para dark/light mode

### Componentes principales

- Atoms: Button, Input, InputCurrency, Select, Badge, Checkbox, etc.
- Molecules: FormFields, Table, DataTable, Tabs, Modal
- Organisms: Sidebar, Navbar, Dashboard widgets, Auth forms
- Marketing: Landing pages, Hero, CTA, Footer

### Navegación SPA

- `NavigationContext` para cambiar vistas sin recarga
- Global Search con Ctrl+K
- URL refleja estado: `/ventas/facturacion`

### Rutas principales

```
(auth)/[country]/           # Login, Register, Forgot Password
(marketing)/[country]/      # Landing pages públicas
(dashboard)/               # App autenticada
    ├── Dashboard/
    ├── Sales/             # Bills, Clients, Products, Stores, etc.
    └── Settings/Profile/
Onboarding/                # Wizard de setup inicial
```

---

## Base de Datos

- **Motor**: PostgreSQL 16
- **ORM**: Prisma 7
- **Esquemas**: Modular en `apps/web/prisma/schema/`
  - auth.prisma, company.prisma, crm.prisma, billing.prisma, inventory.prisma, system.prisma
- Timestamps en todas las entidades
- Soft delete (`deletedAt`) en entidades principales

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="..."

# Production
NEXT_PUBLIC_ROOT_DOMAIN="simplapp.com.co"
COOKIE_DOMAIN=".simplapp.com.co"
```

---

## Docker

- `docker-compose.yml`: PostgreSQL + Next.js web
- `Dockerfile`: Multi-stage build con standalone output
- Deploy producción: Vercel (no Docker)

---

## Documentación

**Siempre leer `.docs/` antes de tocar arquitectura o patrones nuevos.**

```
.docs/
├── architecture/          # Data, routing, SPA
├── guides/               # Commits, deploy, design system, feature lifecycle
├── modules/              # Módulos de negocio (bill, etc.)
├── diagrams/             # Diagramas Mermaid
├── decisions/            # ADRs (Architecture Decision Records)
├── Branchs/             # Estrategia de branching
└── runbooks/            # Procedimientos operativos
```

---

## Convenciones

| Categoría | Convención |
|-----------|------------|
| **Commits** | Inglés, atómicos, agrupados por lógica |
| **Código** | Inglés para todos los identificadores |
| **Comunicación** | Español con el usuario |
| **Tipos** | Siempre usar tipos de `@domain` entre packages |
| **Imports** | Alias configurados: `@/*` → `apps/web/*`, `@simplapp/*` → `packages/*` |

---

## Engram Memory

Usar Engram para memoria persistente entre sesiones:
- `mem_save` después de bug fixes y decisiones de arquitectura
- `mem_search` al iniciar trabajo nuevo
- `mem_session_summary` antes de terminar sesión
