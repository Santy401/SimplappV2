# Plan: Módulo de Notas de Crédito

**Fecha:** 2026-03-25

---

## Descripción

Módulo para gestionar notas de crédito vinculadas a facturas existentes. Soporta devoluciones (con reintegro de inventario), descuentos comerciales, y ajuste de precios. Integración con DIAN para facturación electrónica.

---

## Decisiones de Diseño

### Vinculación
- Las NC siempre deben estar vinculadas a una Bill existente (billId obligatorio)

### Tipos de NC
| Tipo | Efecto en Inventario | Efecto Financiero |
|------|---------------------|-------------------|
| RETURN | + Stock | Reduce balance |
| DISCOUNT | Sin cambio | Reduce balance |
| PRICE_ADJUSTMENT | Sin cambio | Reduce balance |

### Motivos DIAN (UBL colombiano)
| Código | Descripción |
|--------|-------------|
| 01 | Devolución parcial |
| 02 | Devolución total |
| 03 | Anulación |
| 04 | Descuento comercial |
| 05 | Descuento condicional |
| 06 | Otro |

### Estados de NC
| Estado | Descripción |
|--------|-------------|
| DRAFT | Borrador |
| ISSUED | Enviada a DIAN |
| APPLIED | Aceptada por DIAN |
| REJECTED | Rechazada por DIAN |
| CANCELLED | Cancelada por usuario |

---

## Validaciones de Negocio

1. **Cantidad no excedida:** `quantity_credit_note ≤ quantity_original - quantity_aplicada`
2. **Total no excedido:** `sum(todas_ncs) ≤ total_factura`
3. **Validaciones pre-transacción** - antes de abrir `$transaction`

---

## Lógica de Actualización de Bill

```typescript
const outstanding = bill.total
  .minus(bill.appliedCreditNoteTotal)
  .minus(bill.paidTotal ?? 0);

if (outstanding.lte(0)) {
  newStatus = BillStatus.PAID;
} else if (bill.appliedCreditNoteTotal.gt(0) || (bill.paidTotal ?? 0) > 0) {
  newStatus = BillStatus.PARTIALLY_PAID;
} else {
  newStatus = bill.status; // mantiene PENDING/TO_PAY
}
```

**Regla:** El status solo asciende: PENDING → PARTIALLY_PAID → PAID

---

## Orden de Implementación

1. **DB + Migraciones** - Prisma schema
2. **Dominio** - Entidades y tipos
3. **Repositorio + Servicio** - Capa de datos
4. **API Routes** - Endpoints REST
5. **Lógica de negocio** - Validaciones + transacción atómica
6. **UI** - Tabla + Formulario
7. **DIAN** - Integración final

---

## Archivos a Crear/Modificar

### Prisma
- `apps/web/prisma/schema/billing.prisma`

### Domain
- `packages/domain/src/entities/CreditNote.entity.ts`

### Interfaces
- `packages/interfaces/src/repositories/credit-note.repository.ts`
- `packages/interfaces/src/services/credit-note.service.ts`
- `packages/interfaces/src/hooks/features/CreditNotes/useCreditNote.ts`

### API
- `apps/web/app/api/credit-notes/route.ts`
- `apps/web/app/api/credit-notes/[id]/route.ts`

### UI
- `packages/ui/src/config/CreditNote/columns.tsx`
- Componentes de formulario (reutilizar FormBill)

---

## Transacción Atómica

```typescript
await prisma.$transaction(async (tx) => {
  // 1. Crear CreditNote
  const creditNote = await tx.creditNote.create({...});

  // 2. RETURN → reintegrar stock
  if (type === 'RETURN') {
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });
    }
  }

  // 3. Update atómico del balance
  const updatedBill = await tx.bill.update({
    where: { id: billId },
    data: { appliedCreditNoteTotal: { increment: total } },
    select: { total: true, appliedCreditNoteTotal: true, paidTotal: true }
  });

  // 4. Recalcular status
  const outstanding = updatedBill.total
    .minus(updatedBill.appliedCreditNoteTotal)
    .minus(updatedBill.paidTotal ?? 0);

  let newStatus: BillStatus;
  if (outstanding.lte(0)) {
    newStatus = BillStatus.PAID;
  } else if (updatedBill.appliedCreditNoteTotal.gt(0) || (updatedBill.paidTotal ?? 0) > 0) {
    newStatus = BillStatus.PARTIALLY_PAID;
  } else {
    newStatus = updatedBill.status;
  }

  await tx.bill.update({
    where: { id: billId },
    data: { status: newStatus }
  });
});
```
