# 🗺️ Guía de Diagramación y Arquitectura Visual

En Simplapp V2 utilizamos un enfoque de **Diagramas como Código y Herramientas Visuales Integradas** dentro de VS Code para mantener nuestra documentación técnica siempre viva y pegada a nuestro repositorio.

Para evitar "parálisis por análisis" y mantener la consistencia en el equipo, hemos adoptado una estrategia híbrida utilizando **Excalidraw** y **Draw.io**. Cada herramienta tiene un propósito específico dentro de nuestra carpeta `.docs`.

---

## 🎨 Cuándo usar Excalidraw (`.excalidraw`)
*Excalidraw se utiliza para explicar conceptos, flujos de UX/UI, y arquitecturas modulares a alto nivel. Su estilo es amigable y fomenta la discusión rápida.*

**Debes usar Excalidraw para documentar:**

1. **Arquitectura del Monorepo (Packages & Apps):**
   - Cómo se comunican `@simplapp/ui`, `@simplapp/domain`, la API y la aplicación web.
   - Ideal para entender las dependencias del `package.json` de un vistazo.
2. **Data Fetching y Estado de React Query:**
   - Flujos de "Mutación de Datos" (ej: *Usuario hace click -> React Query ejecuta mutación -> Muestra Toast -> Invalida caché*).
3. **Flujos Lógicos de Negocio Moderno:**
   - La orquestación del **Multitenancy**: Cómo un usuario puede cambiar entre empresas que administre (el Context Provider o Zustand store manejando el cambio de `companyId`).
   - El proceso de Autenticación con JWT, Cookies HttpOnly y Next.js Middleware.
4. **Wireframing / User Journeys (Bocetos):**
   - Ideal para trazar rápidamente cómo va a lucir una pantalla del Dashboard o una tabla compleja de CRUD antes de programar en Radix UI.

**Ubicación sugerida en el repo:** `.docs/diagrams/workflows/` y `.docs/architecture.md`

---

## 🏛️ Cuándo usar Draw.io (`.drawio` o `.drawio.svg`)
*Draw.io se utiliza cuando la exactitud técnica es crítica (Single Source of Truth), requiriendo modelos estructurados, rejillas perfectas e iconografía corporativa.*

**Debes usar Draw.io para documentar:**

1. **El Entity Relationship Diagram (ERD):**
   - Toda la estructura de PostgreSQL orquestada en Prisma.
   - Tablas, campos clave (PK/FK), multiplicidad `1:N` o `N:M`, y tipos de datos exactos (String, UUID, Decimal, Relaciones Cascade).
   - *Este diagrama nunca debe ser ambiguo, ya que de él dependen los migrations de la DB.*
2. **Infraestructura Cloud y Redes (DevOps):**
   - Cómo se mapean los servidores (Deploy en Vercel, RDS/Supabase para la base de datos, Storage en S3, servicios externos como Stripe o Resend).
3. **Flujos Financieros Estrictos (SaaS/Core):**
   - El ciclo de vida súper específico de una Factura (DIAN): De *Borrador* a *Emitida*, el firmado XML y los consecuentes de Recibos de Caja (`Bill` -> `Payment`).
4. **Máquinas de Estado Finito:**
   - Para controlar transiciones de Enums complejos (ej: `SubscriptionStatus`: ACTIVE -> PAST_DUE -> CANCELED).

**Ubicación sugerida en el repo:** `.docs/diagrams/infrastructure/` y `.docs/guides/`

---

## 🚀 Mejores Prácticas Generales

- **Nombra los archivos explícitamente:** Ej. `auth-flow.excalidraw`, `database-erd.drawio.svg`.
- **Incrusta los diagramas en Markdown:** 
  Las extensiones de VS Code para Excalidraw y Draw.io permiten guardar los archivos como `.svg`, lo cual mantiene en código el diagrama editable, pero permite que GitHub los renderice en la página principal:
  
  ```md
  ![Autenticación Simplapp](./auth-flow.excalidraw.svg)
  ```
- **Haz diagramas pequeños:** Es mejor tener 3 diagramas atómicos (ej: *Facturación*, *Inventario*, *Membresías*) que un solo lienzo gigantesco incomprensible.
