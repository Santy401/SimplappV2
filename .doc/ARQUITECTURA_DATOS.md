# Arquitectura de Datos y Contexto - Simplapp V2

## 🧬 Flujo de Datos
Simplapp V2 utiliza un enfoque de **Estado Persistente** y **Contextos Globales** para mantener la coherencia en su interfaz SPA (Single Page Application).

### 1. Source of Truth (Fuente de Verdad)
-   **Base de Datos**: PostgreSQL (vía Prisma).
-   **Caché Server-Side**: TanStack Query (React Query) gestiona la caché de datos de la API en el cliente.
-   **Sesión**: `SessionContext` mantiene los datos del usuario logueado y la empresa activa.

---

## 🧠 Contextos Principales

### `NavigationContext`
Gestiona en qué "página" está el usuario dentro del dashboard SPA.
-   **Sincronización**: Mantiene la URL del navegador sincronizada con el estado de React (`currentView`).
-   **Navegación**: Proporciona la función `navigateTo(view)`.

### `AppStateContext`
Gestiona la selección global de entidades. Si seleccionas un cliente en la lista, este contexto guarda ese cliente para que puedas ir a "Crear Factura" y los datos ya estén ahí.
-   **Persistencia**: Usa `localStorage` (vía `usePersistedState`) para que los datos no se borren al refrescar la página.
-   **Entidades**: `selectedClient`, `selectedProduct`, `selectedBill`, etc.

### `LoadingContext`
Proporciona un estado de carga global (spinner o barra de progreso) para acciones de larga duración que bloquean la UI.

---

## 🗄️ Estructura de Base de Datos (Simplificada)
-   **User**: Credenciales y perfil.
-   **Company**: Datos legales y configuración de facturación.
-   **UserCompany**: Tabla pivot para multi-empresa (asocia usuarios a empresas con roles).
-   **Client / Product / Seller**: Entidades de negocio ligadas a una `Company`.
-   **Bill (Factura)**: Entidad central que relaciona cliente, productos (vía `BillItem`), vendedor y empresa.

---

## 🔐 Seguridad y Auth
1.  **JWT en Cookies**: Los tokens no se guardan en `localStorage` por seguridad (evita XSS). Se usan cookies `httpOnly`.
2.  **Auth Guard**: El middleware `proxy.ts` verifica la existencia de la sesión antes de permitir el acceso al dashboard.
3.  **Soft Delete**: Casi todas las entidades usan `deletedAt` en lugar de borrado físico para evitar pérdida accidental de datos contables.
