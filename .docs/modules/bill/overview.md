# 🧾 Módulo de Facturación (Bill) - Visión General

El módulo de Facturación (`Bill`) es uno de los componentes centrales de Simplapp V2. Conecta la gestión de ventas, clientes, inventario, tesorería (pagos) y la DIAN (facturación electrónica).

## 📍 Ubicaciones Clave en el Monorepo
*   **Entidad de Dominio:** `packages/domain/src/entities/Bill.entity.ts` (Tipos, Enums de estados).
*   **Modelo de Base de Datos:** `apps/web/prisma/src/generated/prisma/schema.prisma` (Modelo Prisma `Bill`, `BillItem`, `Payment`).
*   **Rutas de API:** `apps/web/app/api/bills/*` (Endpoints HTTP).

## 🗄️ Relaciones del Modelo
La entidad `Bill` actúa como un conector ("hub") que interactúa con otras entidades del sistema:

*   **`Company` (`companyId`)**: Toda factura le pertenece estrictamente a una empresa (Tenant Isolation).
*   **`Client` (`clientId`)**: El sujeto a quién se le facturó. Al momento de generar la factura, los datos del cliente se copian (snapshot) en los campos de la factura (`clientName`, `clientIdentification`, etc.) para asegurar inmutabilidad fiscal y legal si el cliente cambia después.
*   **`Store` (`storeId`)**: La bodega o sucursal desde donde salen los productos físicos.
*   **`User` (`userId`)**: El usuario/operario del sistema que creó el registro en nombre de la empresa.
*   **`Seller` (`sellerId`)**: El vendedor asociado a la venta, útil para el cálculo de comisiones (Opcional).

## 🏗️ Composición de la Factura
Una factura siempre se compone del "Encabezado" (`Bill`) que incluye totales y fechas, y del "Detalle":
*   **`BillItem`**: Contiene los productos o servicios facturados, cantidad, precio e impuestos (Snapshot del producto para asegurar inmutabilidad).
