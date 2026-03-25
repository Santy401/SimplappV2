# Simplapp V2 — Todo List

## 🔴 Alta Prioridad (Bloqueantes para producción)

### Performance & UX

- [ ] **Agregar `loading.tsx`** en `(dashboard)/layout.tsx`
  - Loading state mientras cargan los datos iniciales
  - Skeleton para sidebar y contenido

- [ ] **Agregar `error.tsx`** en `(dashboard)/layout.tsx`
  - Manejo de errores con opción de reintentar
  - Error boundary para toda la app autenticada

- [ ] **Agregar `global-error.tsx`** en `app/`
  - Captura errores fatales que `error.tsx` no puede manejar

### Docker Producción

- [ ] **Healthcheck en Dockerfile**
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
  ```

- [ ] **Script de entrypoint para migraciones**
  - Aplicar `prisma migrate deploy` antes de iniciar
  - Manejar rollbacks si falla

- [ ] **Validar build de producción**
  - `pnpm build` debe pasar sin errores
  - Verificar que `standalone` output funciona

### Testing

- [ ] **Verificar que tests pasan**
  - `pnpm test` o el comando que esté configurado
  - Si no hay tests, considerar agregar al menos smoke tests

---

## 🟡 Media Prioridad (Mejoras significativas)

### Next.js Optimization

- [ ] **Crear `not-found.tsx`** para rutas 404 elegantes
  - tanto en `(dashboard)` como en `(marketing)`

- [ ] **Migrar pages estáticas a RSC**
  - Landing pages (`(marketing)`) pueden ser Server Components
  - Beneficiarse de streaming y data fetching en server

- [ ] **Suspense boundaries apropiados**
  - Para componentes que usan `useSearchParams`
  - Evitar hydration errors

### Code Quality

- [ ] **Extraer lógica de API routes duplicada**
  - `getAuthContext()` ya está bien, pero verificar que todas las rutas lo usan
  - Considerar un wrapper de API routes

- [ ] **Agregar типизация consistente**
  - Tipos explícitos en lugar de `any`
  - Especialmente en `Onboarding` y handlers

### Documentación

- [ ] **Actualizar `.docs/` con decisiones de arquitectura**
  - ADR para el patrón SPA con NavigationContext
  - ADR para multi-tenancy

---

## 🟢 Baja Prioridad (Nice to have)

### DX (Developer Experience)

- [ ] **Agregar `.vscode/` settings compartidos**
  - Formato al guardar
  - Extensiones recomendadas

- [ ] **Git hooks con Husky/Lint-staged**
  - Pre-commit checks
  - Commit message validation

### Optimizaciones

- [ ] **Code splitting por ruta**
  - Lazy load componentes pesados
  - Analizar bundle con `pnpm analyze`

- [ ] **Optimizar imágenes**
  - Usar `next/image` donde no se esté usando
  - Blur placeholders para imágenes grandes

- [ ] **Prefetch de rutas**
  - `<Link prefetch>` para navegación anticipada

### Features

- [ ] **PWA support** (opcional)
  - Service worker para offline
  - Install prompt

- [ ] **Dark mode** (verificar que esté completo)
  - `next-themes` ya está, verificar que todos los componentes lo usan

---

## 📋 Checklist de Merge a Development

Antes de hacer merge, verificar:

```bash
# 1. Build pasa
pnpm build

# 2. Typecheck pasa
pnpm check-types

# 3. Lint pasa
pnpm lint

# 4. No hay console.log de debug
rg "console\.log" apps/web/app/ --type tsx

# 5. Variables de entorno necesarias documentadas
cat apps/web/.env.example 2>/dev/null || echo "Crear .env.example"
```

---

## 📊 Métricas de Progreso

| Categoría | Total | Completado | Progreso |
|-----------|-------|------------|----------|
| Alta Prioridad | 6 | 0 | 0% |
| Media Prioridad | 6 | 0 | 0% |
| Baja Prioridad | 7 | 0 | 0% |
| **Total** | **19** | **0** | **0%** |

---

## 🔗 Referencias

- [Next.js Best Practices Skill](../.agents/skills/next-best-practices/)
- [OPENCODE.md](./OPENCODE.md)
- [Documentación arquitectura](../.docs/architecture/)
