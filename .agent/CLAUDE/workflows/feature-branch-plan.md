---
description: Track and implement missing features and remaining tech debt
---

# Branch: `feature/tech-debt-and-new-features`

## Scope
Este branch cubre toda la funcionalidad faltante del SaaS y la deuda técnica
que requería Sprint dedicado. Viene de `hardening/security-performance-cleanup`.

## Prioridad de implementación

### 🥇 ALTA — Bloqueantes para usuarios reales

1. **Recuperación de contraseña** (`/forgot-password`)
   - Ruta de marketing: `app/(auth)/[country]/ForgotPassword/page.tsx`
   - API: `/api/auth/forgot-password` → genera token temporal → envía email
   - API: `/api/auth/reset-password` → verifica token → actualiza contraseña
   - Requiere: Email transaccional (Resend)

2. **Email transaccional** (Resend)
   - Setup: instalar `resend`, crear `lib/email.ts`
   - Templates: bienvenida, reset-password, factura enviada al cliente

3. **Deep Links / URLs profundas**
   - Deuda técnica: el Router SPA no tiene URLs reales
   - Migrar `layout.tsx` de `switch(currentView)` a rutas de Next.js
   - `/dashboard`, `/dashboard/ventas/clientes`, `/dashboard/ventas/clientes/[id]`, etc.
   - Habilita: botón atrás, compartir links, SEO básico

4. **Exportación de datos CSV/Excel**
   - API: `GET /api/clients/export`, `/api/bills/export`, `/api/products/export`
   - Usar `papaparse` o similar para CSV
   - Botón en cada listado del dashboard

### 🥈 MEDIA — Mejora de producto significativa

5. **Dashboard de métricas**
   - API: `GET /api/stats` → ventas del mes, clientes activos, facturas pendientes
   - Vista Dashboard en `app/(dashboard)/Dashboard/page.tsx`
   - Gráficos con recharts o chart.js

6. **Búsqueda global funcionando**
   - `GET /api/search?q=...` → busca en clientes, facturas, productos, vendedores
   - Conectar el componente `GlobalSearch` del Navbar a este endpoint
   - Resultados agrupados por tipo

7. **Responsive / Mobile**
   - Auditoría con DevTools (simular 375px, 768px)
   - Sidebar colapsable en móvil
   - Tablas horizontalmente scrollables

8. **Verificación de email**
   - Flag `emailVerified: Boolean` en User
   - Enviar email con link de verificación al registrar
   - Bloquear login si no verificado (con mensaje claro)

### 🥉 BAJA — Nice to have

9. **Notificaciones en-app**
   - Listado de alertas: facturas vencidas, rechazos DIAN
   - Toast o panel de notificaciones

10. **Multi-empresa en UI**
    - Company switcher en el Navbar (ya tiene el componente)
    - Requiere: primero completar la separación User/Company

11. **Planes de suscripción / Billing**
    - Integración Stripe o Wompi
    - Limitar features por plan

### 📝 Documentación (hacerlo al final, una sola vez)

12. `.env.example` actualizado con todas las variables
13. `README.md` con setup local para desarrollador nuevo
14. Documentación de API endpoints
