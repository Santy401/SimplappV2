# 🌐 Rutas y Endpoints API (Facturación)

Todas las rutas para la facturación (al ser un uso SPA y API Backend integradas en Next.js App Router) reciden en `apps/web/app/api/bills`.

## Endpoints de Alta y Lectura
- **`GET /api/bills`** 
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/route.ts`
  - **Función:** Lectura y filtrado paginado del historial de facturas.
  - **Filtros Soportados:** Por `clientId`, rango de fechas, o un `status` particular.
- **`POST /api/bills`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/route.ts`
  - **Función:** Creación de una factura (comúnmente como `DRAFT`).
  - **Detalle:** Enlaza el `clientId` y registra el listado de `items`. Guarda las direcciones, y si el listado falla limpia la info de borradores. Se encarga de la numeración transitoria. Notifica la creación en el sistema de alertas (campanita del software).

## Endpoints de Transición (Actualizaciones puntuales)
- **`POST /api/bills/[id]/issue`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/[id]/issue/route.ts`
  - **Función:** Transición `DRAFT` ➡️ `ISSUED`.
  - **Detalle:** Realiza el cierre de la factura dejándola estéril a cambios de línea y lista para la DIAN. Notifica vía sistema de campanita cuando es exitoso.
- **`POST /api/bills/[id]/cancel`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/[id]/cancel/route.ts`
  - **Función:** Transmuta la factura a `CANCELLED`. Invalida la recolección y libera la mercancía apartada (si fue extraida para venta en inventario).
- **`GET | POST | DELETE /api/bills/[id]/*`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/[id]/route.ts`
  - **Función:** Mantenimiento (CRUD completo de la factura individual si está en forma de borrador).

## Endpoints Integración Financiera y Pagos
- **`POST | GET /api/bills/[id]/payments`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/bills/[id]/payments/route.ts`
  - **Función:** Registrar o consultar pagos (`Payment`) hacia una factura. El registro ajusta automáticamente el `balance` general de la factura y cambia el estado a `PAID` o `PARTIALLY_PAID` basado en la matemática.

## Endpoints Integración DIAN
Se encuentran en `apps/web/app/api/dian`.
- **`POST /api/dian/send/[billId]`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/dian/send/[billId]/route.ts`
  - **Función:** Construye el Payload, el XML con el CUFE, y lo transmite hacia la DIAN para pedir aprobación. Cambia `DianStatus` a `SENT` y adjunta response con `CUFE`.
- **`GET /api/dian/status/[billId]`**
  - **📂 Ubicación del archivo:** `apps/web/app/api/dian/status/[billId]/route.ts`
  - **Función:** Polling del estado de la Factura, validando y trayendo resoluciones desde la DIAN si entró a `ACCEPTED` o `REJECTED`.
