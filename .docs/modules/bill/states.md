# 🔄 Ciclo de Vida y Estados de la Factura (Bill)

La entidad `Bill` contiene dos "máquinas de estado" asíncronas e independientes que operan en simultáneo: El **estado comercial** y el **estado de la DIAN**.

## 1. Estado Comercial (`BillStatus`)
Define la etapa en la que se encuentra la venta dentro del sistema y frente a caja.
> **📌 Ubicación de los Enums:** `packages/domain/src/entities/Bill.entity.ts` y generados en `apps/web/prisma/src/generated/prisma/schema.prisma`.
> **⚙️ Transiciones llevadas a cabo en:** API de facturación (`apps/web/app/api/bills/...`)

-   `DRAFT` **(Borrador)**: Estado inicial por defecto. La factura se está armando, aún no tiene validez contable y permite modificar ítems y totales. Tienen un consecutivo negativo.
-   `ISSUED` **(Emitida)**: La factura se cierra comercialmente. Toma un consecutivo legal final (ej. `[Prefix]-[Number]`) e inmoviliza los datos y los totales. *Solo facturas en estado DRAFT pueden pasar a ISSUED.*
-   `TO_PAY` **(Por Pagar / A Crédito)**: Factura ya emitida donde se pautó un pago a plazos.
-   `PARTIALLY_PAID` **(Abonada)**: Factura ya emitida que ha recibido uno o varios `Payment` pero cuyo saldo o balance aún no llega a $0.
-   `PAID` **(Pagada)**: Factura pagada en su totalidad (`balance = 0`).
-   `CANCELLED` **(Anulada)**: Factura invalidada. No se borra físicamente de la base de datos (por auditoría contable), pero deja de sumar a las ventas.

## 2. Estado de Facturación Electrónica DIAN (`DianStatus`)
Aplica a la tramitación del XML a la dirección de impuestos en Colombia.
> **⚙️ Transiciones llevadas a cabo en:** Endpoints `apps/web/app/api/dian/...`

-   `PENDING`: La factura comercial está emitida pero la transmisión a la DIAN aún está en cola de espera.
-   `SENT`: Se envió el documento a la DIAN y se aguarda la respuesta (Acknowledgment).
-   `ACCEPTED`: La factura fue recibida, validadas sus reglas, y aceptada satisfactoriamente por la entidad fiscal (Se obtiene el `CUFE`).
-   `REJECTED`: El documento falló alguna validación fiscal en la DIAN. Requiere corrección o generación de nota.

## ⚠️ A tener en cuenta (Separación de Preocupaciones)
La facturación electrónica está desacoplada del cierre de caja comercial. Esto permite "Emitir" ventas (cobrarse) en Puntos de Venta (POS) o Web, y emitir en el mismo momento a la entidad fiscal a través de encolamiento (Workers).
