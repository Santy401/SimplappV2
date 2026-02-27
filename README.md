# Simplapp V2 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

Simplapp V2 es la plataforma de gestión empresarial "todo en uno" diseñada para modernizar la operación de las empresas. Desde facturación electrónica hasta control de inventarios y CRM, Simplapp ofrece una interfaz unificada e intuitiva para mantener tu negocio bajo control.

> **"Configura cada proceso, factura en segundos."**

---

## ✨ Características Principales

-   **🚀 Facturación Electrónica V1.0**: Genera facturas, cotizaciones y remisiones cumpliendo con la normativa DIAN en segundos.
-   **📊 Dashboard Inteligente**: Visualiza la salud de tu negocio en tiempo real con métricas precisas y gráficos interactivos (Recharts).
-   **👥 CRM & Proveedores**: Registro detallado de clientes y proveedores para fortalecer tus relaciones comerciales.
-   **📦 Control de Inventarios**: Seguimiento de stock, bodegas ilimitadas y alertas de vencimiento.
-   **📄 Exportación Masiva**: Exporta tus datos a CSV profesionalmente para informes contables.
-   **🎨 UX Premium**: Interfaz moderna con modo oscuro, glassmorphism y animaciones fluidas (Framer Motion).
-   **🌐 Arquitectura Multi-dominio**: Separación de Marketing y Dashboard mediante subdominios (`app.simplapp.com.co`).

---

## 🛠️ Stack Tecnológico

> 📄 Para una lista detallada de librerías y herramientas, consulta el documento: **[Stack Tecnológico](.doc/STACK_TECNOLOGICO.md)**.

-   **Framework**: Next.js 16 (App Router) + React 19.
-   **Base de Datos**: PostgreSQL + Prisma 7.
-   **Estilos**: Tailwind CSS 4 + Radix UI.
-   **Estado**: TanStack Query (React Query) + Context API.
-   **Seguridad**: JWT (Jose) + Cookies httpOnly + CSRF Protection.

---

## 📂 Estructura del Proyecto (Monorepo)

```bash
.
├── apps/
│   └── web/              # Aplicación principal Next.js (Dashboard + Marketing)
├── packages/
│   ├── ui/               # Sistema de diseño y componentes compartidos
│   ├── domain/           # Lógica de negocio y entidades de base de datos
│   ├── interfaces/       # Hooks, API client y utilidades core
├── .doc/                 # 📚 Documentación técnica detallada
└── .agent/               # Configuración del agente de IA
```

---

## 🚀 Guía de Instalación Local

### Requisitos Previos
-   [Node.js](https://nodejs.org/) (v20 o superior recomendado).
-   [pnpm](https://pnpm.io/) (Instalado globalmente).
-   Instancia de PostgreSQL activa.

### Pasos
1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/Santy401/SimplappV2.git
    cd SimplappV2
    ```
2.  **Instalar dependencias**:
    ```bash
    pnpm install
    ```
3.  **Configurar Variables de Entorno**:
    Copia el archivo de ejemplo en `apps/web`:
    ```bash
    cp apps/web/.example.env apps/web/.env
    ```
    *Edita `.env` con tus credenciales de base de datos y JWT.*
4.  **Preparar Base de Datos**:
    ```bash
    pnpm --filter web build # Esto genera el cliente de Prisma
    npx prisma migrate dev --schema=apps/web/prisma/schema.prisma
    ```
5.  **Iniciar Servidor de Desarrollo**:
    ```bash
    pnpm dev
    ```
    Visita [http://localhost:3000](http://localhost:3000).

---

## 📚 Documentación Adicional

-   **[Arquitectura de Routing](.doc/ARQUITECTURA_ROUTING.md)**: Cómo funcionan los subdominios y el SPA.
-   **[Arquitectura de Datos](.doc/ARQUITECTURA_DATOS.md)**: Flujo de información y contextos globales.
-   **[Guía de Implementación](.doc/GUIA_IMPLEMENTACION.md)**: Pasos para crear una nueva sección desde cero.
-   **[Guía de Skeletons](.doc/GUIA_SKELETONS.md)**: Cómo usar los estados de carga.
-   **[API Endpoints](.doc/API_ENDPOINTS.md)**: Referencia de rutas del servidor.

---

## 🤝 Contribuciones
Este es un proyecto privado para Simplapp V2. Si eres parte del equipo de desarrollo, asegúrate de seguir la **[Guía de Commits](.doc/GUIA_COMMITS.md)** antes de subir cambios.

Hecho con ❤️ por el equipo de **Simplapp**.
