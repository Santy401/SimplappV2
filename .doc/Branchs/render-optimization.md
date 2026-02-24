# perf/optimize-loading-states

## 📋 Información de la Rama

- **Nombre:** `perf/optimize-loading-states`
- **Tipo:** Performance Optimization
- **Estado:** En Desarrollo
- **Prioridad:** Alta
- **Fecha de Inicio:** Febrero 2026

## 🎯 Objetivo

Implementar un sistema de loading granular por operación en el hook `useBill` para evitar re-renders completos de página y mejorar significativamente la experiencia de usuario.

## 🐛 Problema que Resuelve

Actualmente, el hook `useBill` utiliza un único estado `loading` para todas las operaciones (fetch, create, update, delete), lo que causa:

- Re-renders completos de toda la página en cada operación
- UI "temblorosa" y poco profesional
- Imposibilidad de mostrar feedback específico por operación
- Degradación del rendimiento en operaciones frecuentes

## ✨ Cambios Principales

### 1. Hook `useBill`
- ✅ Refactorización del estado de loading único a objeto con estados granulares
- ✅ Implementación de helper `isLoading` con propiedades específicas por operación
- ✅ Actualización de todos los métodos CRUD para usar loading granular

### 2. Página `BillsPage`
- ✅ Actualización para usar el nuevo objeto `isLoading`
- ✅ Loading completo solo en carga inicial sin datos
- ✅ Estados de loading locales para operaciones específicas
- ✅ Feedback visual en botones durante operaciones

### 3. Componente `DataTable`
- ✅ Nueva prop `isLoading` para recibir estados granulares
- ✅ Loading por fila en operaciones de eliminación
- ✅ Transiciones suaves durante operaciones

### 4. Hook `useBillTable`
- ✅ Asegurar compatibilidad con nuevos estados de loading
- ✅ Callbacks correctamente manejados

## 📁 Archivos Modificados

```
src/
├── hooks/
│   └── features/
│       └── Bills/
│           ├── useBill.ts          // Cambio principal
│           └── useBillTable.ts     // Ajustes menores
└── interfaces/
    └── pages/
        └── Bills/
            └── BillsPage.tsx       // Actualización de UI
└── components/
    └── ui/
        └── DataTable/
            └── DataTable.tsx       // Soporte para loading granular
```

## 🔄 Fases de Implementación

### ✅ Fase 1: Modificar Hook useBill (COMPLETADA)
- [x] Cambiar estado de loading único a objeto
- [x] Crear helper `isLoading`
- [x] Actualizar método `fetchBills`
- [x] Actualizar método `createBill`
- [x] Actualizar método `updateBill`
- [x] Actualizar método `deleteBill`
- [x] Actualizar método `getBill`
- [x] Actualizar return del hook

### 🚧 Fase 2: Modificar BillsPage (EN PROGRESO)
- [x] Actualizar destructuración del hook
- [x] Mejorar condición de loading inicial
- [ ] Agregar estados de loading locales
- [ ] Actualizar botones con feedback visual
- [ ] Pasar estados de loading a DataTable

### ⏳ Fase 3: Modificar DataTable (PENDIENTE)
- [ ] Actualizar interfaces TypeScript
- [ ] Implementar loading por fila
- [ ] Agregar transiciones CSS

### ⏳ Fase 4: Actualizar useBillTable (PENDIENTE)
- [ ] Verificar compatibilidad
- [ ] Ajustar callbacks si es necesario

## 🧪 Testing

### Casos de Prueba

#### Test 1: Carga Inicial
```
DADO que el usuario accede a la página de facturas por primera vez
CUANDO no hay datos en caché
ENTONCES debe mostrarse el spinner de carga completo
Y una vez cargados los datos, el spinner debe desaparecer
```

#### Test 2: Creación de Factura
```
DADO que el usuario hace clic en "Nueva Factura"
CUANDO la operación está en curso
ENTONCES solo el botón debe mostrar estado de "Creando..."
Y el resto de la página debe permanecer interactiva
```

#### Test 3: Eliminación de Factura
```
DADO que el usuario elimina una factura específica
CUANDO la operación está en curso
ENTONCES solo esa fila debe mostrar feedback visual
Y el resto de las filas deben permanecer normales
```

#### Test 4: Múltiples Operaciones
```
DADO que hay múltiples operaciones activas
CUANDO se verifica el estado isLoading.any
ENTONCES debe ser true si al menos una operación está activa
Y debe ser false solo cuando todas las operaciones terminen
```

## 📊 Métricas de Éxito

- ✅ **Reducción de re-renders:** De 100% de página a solo componentes afectados
- 🎯 **Tiempo de respuesta percibido:** Mejora del 60-70%
- 🎯 **Satisfacción del usuario:** Feedback visual inmediato en cada acción
- 🎯 **Código mantenible:** Patrón replicable en otros hooks

## 🔗 Referencias

- **Issue Original:** `#[PERF] Optimizar estados de loading`
- **Documento de Diseño:** `/Docs/perf-optimize-loading-states/PERF-optimize-loading-states.md`
- **Pull Request:** _Pendiente_

## 📝 Notas de Desarrollo

### Decisiones Técnicas

1. **Objeto vs Array para Loading States**
   - Se eligió un objeto con propiedades específicas para mejor type-safety
   - Facilita el acceso directo: `isLoading.create` vs `isLoading.find()`

2. **Helper `isLoading.any`**
   - Útil para deshabilitar acciones globales cuando hay operaciones en curso
   - Implementado con `Object.values().some(Boolean)` para máxima eficiencia

3. **Loading Local en Componentes**
   - Para operaciones específicas de UI (como export)
   - Mantiene separación de responsabilidades

### Lecciones Aprendidas

- ⚠️ **Importante:** Siempre usar `finally` para garantizar que loading se resetee incluso en errores
- 💡 **Tip:** Agregar `setError(null)` al inicio de cada operación para limpiar errores previos
- 🎨 **UX:** Las transiciones CSS suaves mejoran significativamente la percepción de velocidad

## 🚀 Próximos Pasos

1. Completar implementación en `BillsPage`
2. Actualizar `DataTable` con soporte para loading granular
3. Realizar pruebas exhaustivas de usuario
4. Crear Pull Request con documentación completa
5. Aplicar el mismo patrón a otros hooks similares:
   - `useCustomer`
   - `useProduct`
   - `useInventory`

## 🤝 Colaboradores

- **Desarrollador Principal:** [Tu Nombre]
- **Reviewer:** [Nombre del Reviewer]
- **QA:** [Nombre del QA]

## 📅 Timeline

- **Inicio:** Febrero 15, 2026
- **Fase 1 Completada:** //
- **Estimación de Finalización:** Febrero 20, 2026
- **Merge a Develop:** //

---

**Última Actualización:** Febrero 15, 2026