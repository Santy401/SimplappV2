# GEMINI.md — Simplapp V2 Instructional Context

Este archivo proporciona el contexto fundamental y las directrices operativas para el desarrollo de Simplapp V2. Debe utilizarse como referencia principal para asegurar la consistencia arquitectónica y funcional del proyecto.

---

## 🚀 Descripción del Proyecto

**Simplapp V2** es una plataforma de gestión empresarial "todo en uno" (ERP/SaaS) diseñada para modernizar operaciones empresariales. Incluye facturación electrónica (DIAN), control de inventarios, CRM, y un dashboard analítico avanzado.

### 🏗️ Arquitectura del Sistema
El proyecto está estructurado como un **Monorepo** utilizando `pnpm workspaces`:

- **`apps/web`**: Aplicación principal construida con **Next.js 16 (App Router)**. Maneja tanto el Dashboard (SPA) como el Marketing.
- **`packages/domain`** (`@simplapp/domain`): Contiene la lógica de negocio pura, entidades de base de datos (Prisma/Zod) y utilidades core. No tiene dependencias de UI.
- **`packages/interfaces`** (`@simplapp/hooks`): Hooks compartidos, cliente de API y capas de abstracción de datos.
- **`packages/ui`** (`@simplapp/ui`): Sistema de diseño basado en Radix UI y Tailwind CSS v4. Contiene componentes atómicos y moléculas.

---

## 🛠️ Stack Tecnológico Core

- **Framework**: Next.js 16 + React 19.
- **Lenguaje**: TypeScript 5 (Strict Mode).
- **Base de Datos**: PostgreSQL + Prisma ORM 7.
- **Estilos**: Tailwind CSS v4 + Radix UI + Framer Motion.
- **Estado & Datos**: TanStack Query (React Query) + Context API.
- **Seguridad**: JWT (Jose) + Cookies httpOnly + CSRF Protection.

---

## 📜 Convenciones de Desarrollo

1.  **Idiomas**:
    -   **Código**: Todo el código (variables, funciones, clases, archivos) debe estar en **Inglés**.
    -   **Git**: Los mensajes de commit deben estar en **Inglés**.
    -   **Comunicación**: La interacción con el usuario debe ser en **Español**.
2.  **Commits Atómicos**: Agrupar cambios por lógica y dependencia. Nunca hacer commit de código que rompa el build. Seguir la `GUIA_COMMITS.md`.
3.  **Tipado Estricto**: Utilizar siempre interfaces y enums de `@simplapp/domain` para asegurar consistencia. Evitar `any` a toda costa.
4.  **Importaciones**: Usar los alias del workspace (`@simplapp/domain`, `@simplapp/hooks`, `@simplapp/ui`) en lugar de rutas relativas largas.
5.  **Comentarios Educativos**: Añadir comentarios que expliquen la intención funcional para ayudar al aprendizaje del usuario (Modo "Teacher").
6.  **Validación**: Siempre ejecutar `pnpm build` desde la raíz antes de considerar una tarea terminada.

---

## 🛠️ Comandos Clave

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia todos los entornos de desarrollo en paralelo. |
| `pnpm dev:web` | Inicia solo la aplicación web (`apps/web`). |
| `pnpm build` | Construye todos los paquetes y aplicaciones del monorepo. |
| `pnpm lint` | Ejecuta el linter en todo el proyecto. |
| `pnpm --filter simplapp db:seed` | Ejecuta el seeding de la base de datos (Prisma). |

---

## 📂 Documentación de Referencia

- **Arquitectura**: `.docs/architecture.md` (Routing, SPA, Datos).
- **Guías**: `.docs/guides/` (Implementación, Multitenant, Skeletons).
- **Stack**: `.docs/stack/technologies.md`.
- **Workflows**: `.agent/workflows/` (Guías paso a paso para tareas comunes).

---

## 🤖 Rol del Agente (Gemini)

Gemini actúa como el **Desarrollador Iterativo**. Su enfoque es:
-   Resolución rápida de bugs y debugging preciso.
-   Implementación de features siguiendo los patrones definidos en `.docs/guides/implementation.md`.
-   Navegación y manipulación eficiente del sistema de archivos.
-   Mantenimiento de la integridad del monorepo y sus dependencias.
