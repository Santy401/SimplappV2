# Simplapp V2 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)

Simplapp V2 es la plataforma de gestión empresarial **"todo en uno"** diseñada para modernizar la operación de las empresas colombianas. Desde facturación electrónica hasta control de inventarios, notas de crédito y CRM, Simplapp ofrece una interfaz unificada e intuitiva para mantener tu negocio bajo control.

> **"Configura cada proceso, factura en segundos."**

---

## ✨ Características Principales

### 🧾 Facturación
- **Facturación Electrónica**: Genera facturas cumpliendo con la normativa DIAN (CUFE, XML, estados de validación).
- **Notas de Crédito**: Devoluciones, descuentos comerciales y ajustes de precio vinculados automáticamente a facturas.
- **Cotizaciones y Remisiones**: Flujo completo de pre-venta.
- **Gestión de Pagos**: Abonos parciales, múltiples métodos de pago y crédito comercial.
- **Estados de Factura**: Borrador → Emitida → Pagada / Parcialmente Pagada / Por Pagar / Cancelada.

### 📊 Dashboard Inteligente
- Métricas de ventas anuales con filtro por año y comparación vs. año anterior.
- Gráficos interactivos de barras mensuales (Recharts).
- Facturas pendientes de cobro, clientes registrados y ticket promedio.
- Acciones rápidas y recordatorios automáticos.

### 👥 CRM & Proveedores
- Registro detallado de clientes (persona natural y jurídica).
- Vendedores con asignación a facturas.
- Identificación tributaria DIAN (NIT, CC, CE, Pasaporte).

### 📦 Inventario
- Gestión de productos y servicios con categorías.
- Múltiples bodegas con seguimiento de stock (Kárdex).
- Listas de precios configurables (mayorista, minorista, porcentaje).
- Movimientos de inventario: entrada, salida, ajuste, transferencia.

### ⚙️ Configuración Empresarial
- Onboarding guiado paso a paso para nuevas empresas.
- Perfil de empresa con datos fiscales y contables.
- Cuentas bancarias y gestión de tesorería.
- Sistema de notificaciones en tiempo real.

### 🎨 UX Premium
- Interfaz moderna con animaciones fluidas (Framer Motion).
- Skeletons de carga para percepción de rendimiento.
- Exportación masiva a CSV para informes contables.
- Arquitectura multi-dominio: Marketing + Dashboard (`app.simplapp.com.co`).

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Lenguaje** | TypeScript 5 (strict mode) |
| **Base de Datos** | PostgreSQL + Prisma 7 |
| **Estilos** | Tailwind CSS 4 + Radix UI |
| **Estado del Servidor** | TanStack Query (React Query) 5 |
| **Tablas** | TanStack Table 8 |
| **Formularios** | React Hook Form 7 + Zod 4 |
| **Animaciones** | Framer Motion 12 + Lenis (smooth scroll) |
| **Gráficos** | Recharts 3 |
| **Autenticación** | JWT (Jose 6) + Cookies httpOnly |
| **Iconos** | Lucide React |
| **Emails** | Resend |
| **Monorepo** | Turborepo 2 + pnpm Workspaces |
| **Testing** | Vitest 4 |
| **Linting** | ESLint 8 + @typescript-eslint |

> 📄 Documentación detallada del stack: **[`.docs/stack/technologies.md`](.docs/stack/technologies.md)**

---

## 📂 Estructura del Proyecto (Monorepo)

```
.
├── apps/
│   ├── web/                  # Aplicación principal Next.js
│   │   ├── app/
│   │   │   ├── (auth)/       # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── (dashboard)/  # Dashboard, Ventas, Inventario, Settings
│   │   │   ├── (marketing)/  # Landing page pública por país
│   │   │   ├── Onboarding/   # Configuración inicial de empresa
│   │   │   ├── api/          # 19 módulos de API Routes
│   │   │   └── context/      # Contexts globales (Navigation, AppState)
│   │   └── prisma/           # Schema de Prisma y seeders
│   ├── admin/                # Panel de administración (futuro)
│   └── api/                  # API standalone (futuro)
│
├── packages/
│   ├── domain/               # Lógica de negocio pura (sin dependencias UI)
│   │   ├── entities/         # Bill, Client, Company, CreditNote, Product...
│   │   ├── schemas/          # Zod schemas (auth, bills, onboarding)
│   │   └── utils/            # Utilidades de negocio (billing calculations)
│   │
│   ├── interfaces/           # Capa de infraestructura y comunicación
│   │   ├── hooks/features/   # Custom hooks por dominio (useBills, useClients...)
│   │   ├── repositories/     # Repositorios Prisma (Bill, Client, CreditNote, User)
│   │   ├── services/         # Servicios de negocio (BillService, CreditNoteService...)
│   │   ├── contexts/         # Contextos compartidos
│   │   └── types/            # Tipos compartidos
│   │
│   ├── ui/                   # Sistema de diseño (Storybook)
│   │   ├── atoms/            # Componentes base (Button, Input, Badge...)
│   │   ├── molecules/        # Componentes compuestos
│   │   ├── organisms/        # Componentes complejos
│   │   └── hooks/            # Hooks de UI
│   │
│   └── config/               # Configuración compartida (tailwind preset)
│
├── tools/
│   ├── prompts/              # Prompts para agentes IA
│   └── seeders/              # Scripts de seed de datos
│
├── .docs/                    # 📚 Documentación técnica completa
│   ├── architecture/         # Arquitectura de datos y routing
│   ├── api/                  # Documentación de endpoints
│   ├── guides/               # Guías de implementación, commits, deployment...
│   ├── modules/              # Documentación por módulo
│   ├── diagrams/             # Diagramas del sistema
│   ├── runbooks/             # Playbooks operacionales
│   ├── decisions/            # Decisiones arquitectónicas (ADR)
│   └── stack/                # Detalle del stack tecnológico
│
└── .agents/                  # 🤖 Configuración de agentes IA
    ├── CLAUDE/               # Agente Arquitecto
    ├── GEMINI/               # Agente Desarrollador Iterativo
    ├── skills/               # Skills especializados (GSAP, refactoring, design)
    └── instructions.md       # Reglas compartidas
```

---

## 🧩 Módulos de la API

La API de Simplapp expone **19 módulos** a través de Next.js API Routes:

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Auth | `/api/auth` | Login, registro, tokens JWT, refreshh |
| Bills | `/api/bills` | CRUD de facturas con lógica de estados |
| Clients | `/api/clients` | Gestión de clientes |
| Products | `/api/products` | Productos y servicios |
| Credit Notes | `/api/credit-notes` | Notas de crédito vinculadas a facturas |
| Payments | `/api/payments` | Gestión de pagos y abonos |
| Stores | `/api/stores` | Bodegas e inventario |
| Categories | `/api/categories` | Categorías de productos |
| Sellers | `/api/sellers` | Vendedores |
| List Prices | `/api/list-prices` | Listas de precios |
| Bank Accounts | `/api/bank-accounts` | Cuentas bancarias y tesorería |
| Company | `/api/company` | Datos de la empresa |
| User | `/api/user` | Perfil de usuario |
| Metrics | `/api/metrics` | Dashboard y métricas de negocio |
| Notifications | `/api/notifications` | Sistema de notificaciones |
| Export | `/api/export` | Exportación CSV |
| Search | `/api/search` | Búsqueda global |
| DIAN | `/api/dian` | Integración facturación electrónica |
| Activity Log | `/api/activity-log` | Registro de actividad |

---

## 🚀 Guía de Instalación Local

### Requisitos Previos
- [Node.js](https://nodejs.org/) v20 o superior.
- [pnpm](https://pnpm.io/) v10+ (instalado globalmente).
- Instancia de **PostgreSQL** activa.

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Santy401/SimplappV2.git
   cd SimplappV2
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Configurar Variables de Entorno**:
   ```bash
   cp apps/web/.example.env apps/web/.env
   ```
   Edita `.env` con tus credenciales de base de datos y secretos JWT.

4. **Preparar Base de Datos**:
   ```bash
   cd apps/web
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Seed de datos (opcional)**:
   ```bash
   pnpm db:seed
   ```

6. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm dev        # Todos los packages
   pnpm dev:web    # Solo la app web
   ```
   Visita [http://localhost:3000](http://localhost:3000).

---

## 🧪 Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev servers de todos los packages (Turbo) |
| `pnpm dev:web` | Solo la app Next.js |
| `pnpm build` | Build de producción |
| `pnpm check-types` | Verificación de tipos TypeScript |
| `pnpm lint` | ESLint en todos los packages |
| `pnpm lint:fix` | Auto-fix de ESLint |
| `pnpm clean` | Limpiar artefactos de build |
| `npx vitest run` | Ejecutar todos los tests |
| `npx vitest run <file>` | Ejecutar un test específico |

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [Arquitectura del sistema](.docs/architecture.md) | Índice de documentación técnica |
| [Arquitectura de Datos](.docs/architecture/data.md) | Estado, contextos y base de datos |
| [Arquitectura de Routing](.docs/architecture/routing.md) | SPA, middleware y subdominios |
| [API Endpoints](.docs/api/endpoints.md) | Referencia completa de la API |
| [Guía de Implementación](.docs/guides/implementation.md) | Cómo crear features nuevas |
| [Guía de Commits](.docs/guides/commits.md) | Convenciones de commits |
| [Deployment](.docs/guides/deployment.md) | Despliegue con Vercel |
| [Multitenant](.docs/guides/multitenant.md) | Manejo multi-empresa |
| [Design System](.docs/guides/design-system.md) | Sistema de diseño y componentes |
| [Prisma Setup](.docs/guides/prisma-monorepo-setup.md) | Configuración de Prisma en monorepo |
| [Skeletons](.docs/guides/skeletons.md) | Estados de carga |

---

## 🤖 Agentes IA

Este proyecto utiliza dos agentes especializados de IA para asistir en el desarrollo:

- **Claude** (`.agents/CLAUDE/`): Arquitecto — planificación, diseño de features y refactors complejos.
- **Gemini** (`.agents/GEMINI/`): Desarrollador Iterativo — iteración rápida, bug fixing y ejecución.

Las instrucciones compartidas están en [`.agents/instructions.md`](.agents/instructions.md) y las reglas generales para agentes en [`AGENTS.md`](AGENTS.md).

---

## 🤝 Contribuciones

Este es un proyecto privado para Simplapp V2. Si eres parte del equipo de desarrollo:

1. Lee la **[Guía de Commits](.docs/guides/commits.md)** antes de subir cambios.
2. Consulta la **[Guía de Implementación](.docs/guides/implementation.md)** para crear nuevas features.
3. Asegúrate de pasar `pnpm build && pnpm check-types && pnpm lint` antes de hacer push.

---

Hecho con ❤️ por el equipo de **Simplapp**.
