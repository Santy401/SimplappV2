# Guía de Estilo — Simplapp Design System v2

Este documento define la identidad visual de **Simplapp** y cómo aplicarla de manera consistente en todos los componentes: modales, formularios, vistas de detalle, tablas, badges y estados vacíos.

> **Regla de oro:** Simplapp no es Alegra, no es Notion, no es Linear. Tiene su propio lenguaje. Cuando dudes, consulta este documento antes de copiar un estilo externo.

---

## 1. 🎨 Paleta de Colores

### Color de Marca (Brand)

El color de Simplapp es un **violeta-azulado vibrante** (`#6C47FF`).

| Nombre              | CSS Variable            | Valor       | Tailwind / uso directo        | Uso principal                                   |
| ------------------- | ----------------------- | ----------- | ----------------------------- | ----------------------------------------------- |
| **Brand Primary**   | `--brand`               | `#6C47FF` ⭐ | `bg-brand` / `text-brand`     | Botón primario, íconos de acción, totales       |
| **Brand Hover**     | `--brand-hover`         | `#5835E8`   | `hover:bg-brand-hover`        | Estado hover del botón primario                 |
| **Brand Light**     | `--brand-light`         | `#8B6EFF`   | `text-brand-light`            | Textos sobre fondo oscuro (dark mode)           |
| **Brand Subtle BG** | `--brand-subtle-bg`     | `#6C47FF12` | `bg-[#6C47FF]/8`              | Fondo de icon wrappers, badges, total highlight |
| **Brand Border**    | `--brand-subtle-border` | `#6C47FF25` | `border-[#6C47FF]/20`         | Borde del badge de número, card de total        |
| **Brand Text**      | `--brand-foreground`    | `#ffffff`   | `text-brand-foreground`       | Texto sobre botón de marca                      |

> 🎯 **Regla de oro:** Nunca uses `#6C47FF` hardcodeado en el código. Usa siempre las clases de Tailwind o las CSS variables. La única excepción aceptada durante desarrollo rápido es `text-[#6C47FF]` / `bg-[#6C47FF]` mientras las variables se configuran en `globals.css`.

### Superficies

| Nombre          | Light                  | Dark                    | Uso                                   |
| --------------- | ---------------------- | ----------------------- | ------------------------------------- |
| **Page BG**     | `slate-50` (`#f8fafc`) | `slate-950` (`#020617`) | Fondo de página                       |
| **Card BG**     | `white` (`#ffffff`)    | `slate-900` (`#0f172a`) | Cards, modales, documentos            |
| **Elevated BG** | `white` (`#ffffff`)    | `slate-800` (`#1e293b`) | Inputs, tabs activos, tooltips        |
| **Inner BG**    | `slate-50/80`          | `slate-800/40`          | Headers de tabla, filas hover suaves  |

### Bordes

| Nombre           | Light                   | Dark                    | Uso                                         |
| ---------------- | ----------------------- | ----------------------- | ------------------------------------------- |
| **Border Base**  | `slate-200` (`#e2e8f0`) | `slate-800` (`#1e293b`) | Cards, inputs, divisores principales        |
| **Border Inner** | `slate-100` (`#f1f5f9`) | `slate-800` (`#1e293b`) | Divisores internos dentro de un card        |

---

## 2. 🔤 Tipografía

Simplapp usa **Geist Sans** (vía `--font-geist-sans`).

### Firma tipográfica — Labels

```
text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400
```

Esta es **la firma tipográfica de Simplapp**. Se usa en:
- Labels de campos de formulario
- Títulos de subsección dentro de cards (`"Información del cliente"`, `"Fechas y estado"`)
- Headers de notas y términos en documentos

### Jerarquía completa

| Elemento                   | Clases                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Título de página (navbar)  | `text-sm font-semibold text-slate-800 dark:text-slate-200`          |
| Título de sección (card)   | `text-sm font-semibold text-slate-700 dark:text-slate-300`          |
| Sub-header dentro de card  | `text-xs font-semibold uppercase tracking-wide text-slate-500`      |
| Label de campo             | `text-xs font-medium uppercase tracking-wide text-slate-500`        |
| Texto de cuerpo            | `text-sm text-slate-700 dark:text-slate-300`                        |
| Texto secundario / meta    | `text-sm text-slate-500 dark:text-slate-400`                        |
| Texto de badge / chip      | `text-xs font-semibold`                                             |
| Número destacado (total)   | `text-2xl font-bold text-[#6C47FF]`                                 |
| Número documento (No.)     | `text-lg font-bold text-[#6C47FF]`                                  |

---

## 3. 🧱 Componentes Atómicos Reutilizables

Estos átomos se definen **una sola vez** y se usan en todos los formularios y vistas de detalle.

### SectionCard

Envuelve cualquier bloque de contenido agrupado.

```tsx
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
```

### SectionHeader

Header estándar dentro de un `SectionCard`. Lleva siempre un ícono con wrapper de marca.

```tsx
function SectionHeader({ icon: Icon, title, badge }: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-[#6C47FF]/10 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#6C47FF]" />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
      {badge}
    </div>
  );
}
```

### FieldLabel

Label de campo en formularios. El asterisco obligatorio es siempre violeta, nunca rojo.

```tsx
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
      {children}
      {required && <span className="ml-1 text-[#6C47FF] font-bold">*</span>}
    </label>
  );
}
```

### InfoRow

Fila de dato en vistas de detalle (BillPreview, etc.). No se usa en formularios editables.

```tsx
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right">{value}</span>
    </div>
  );
}
```

### StyledInput

```tsx
function StyledInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    />
  );
}
```

### StyledSelect

Los selects siempre usan wrapper para reemplazar el chevron nativo del browser.

```tsx
function StyledSelect({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30 focus:border-[#6C47FF]
          appearance-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}
```

### StyledTextarea

```tsx
function StyledTextarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/30
        focus:border-[#6C47FF] transition-all resize-none
        disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    />
  );
}
```

> ⚠️ **Regla:** Todos estos átomos van en un archivo compartido (ej: `ui/FormAtoms.tsx`) y se importan desde ahí. Nunca se redefinen inline en cada componente.

---

## 4. 🪟 Layout de Páginas Completas (Formularios y Vistas de Detalle)

Tanto los formularios de creación/edición (`FormBill`) como las vistas de detalle (`BillPreview`) comparten **exactamente la misma estructura de página**.

### Estructura obligatoria

```
[Sticky Nav Bar — h-14, backdrop-blur-md, border-b]
  ↳ izquierda: [Volver ←] [separator] [ícono] [Título] [StatusBadge]
  ↳ derecha:   [acciones secundarias outline] [CTA primario bg-brand]

[Page BG: slate-50 / slate-950 — py-8 px-6 max-w-6xl mx-auto space-y-5]
  ↳ SectionCard (configuración / resumen)
  ↳ SectionCard (documento / detalle principal)
  ↳ SectionCard (tabla de ítems)
  ↳ Row: elemento-izquierda + card-de-totales (md:w-72)
  ↳ SectionCard (notas, términos, pie)
  ↳ Row de acciones finales
```

### Navbar Sticky — patrón exacto

```tsx
<div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

    {/* Izquierda */}
    <div className="flex items-center gap-3">
      <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </button>
      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-2">
        <IconoRelevante className="w-4 h-4 text-[#6C47FF]" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Título de página</span>
        <StatusBadge status={status} />
      </div>
    </div>

    {/* Derecha */}
    <div className="flex items-center gap-2">
      {/* Secundarios */}
      <button className="h-8 px-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-40">
        <IconoSecundario className="w-3.5 h-3.5" />
        Acción secundaria
      </button>
      {/* Primario */}
      <button className="h-8 px-4 rounded-lg text-sm font-semibold text-white bg-[#6C47FF] hover:bg-[#5835E8] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#6C47FF]/25 disabled:opacity-40">
        <IconoPrimario className="w-3.5 h-3.5" />
        Acción principal
      </button>
    </div>

  </div>
</div>
```

> **Nota de tamaños:** Los botones en la navbar usan `h-8` (compacto). Los botones en el footer de página usan `h-9` (estándar).

---

## 5. 🏷️ Badges de Estado

### statusConfig — objeto centralizado

Siempre define los estados en un objeto único por entidad. Nunca uses colores hardcodeados por estado en múltiples lugares.

```tsx
const statusConfig: Record<BillStatus, {
  label: string;
  badge: string;   // clases Tailwind para el pill
  ribbon: string;  // clase bg para la cinta diagonal
  icon: React.ElementType;
}> = {
  DRAFT:          { label: "Borrador",     badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",        ribbon: "bg-slate-400",  icon: FileText    },
  ISSUED:         { label: "Emitida",      badge: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",          ribbon: "bg-blue-500",   icon: ReceiptText },
  PAID:           { label: "Pagada",       badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", ribbon: "bg-emerald-500", icon: CheckCircle2 },
  PARTIALLY_PAID: { label: "Pago Parcial", badge: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",      ribbon: "bg-amber-500",  icon: AlertCircle },
  CANCELLED:      { label: "Cancelada",    badge: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",              ribbon: "bg-red-500",    icon: Ban         },
  TO_PAY:         { label: "Por Pagar",    badge: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",  ribbon: "bg-violet-500", icon: Clock       },
};
```

### Pill de estado (navbar y tablas)

```tsx
// Con ícono — usado en navbar
<span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
  <StatusIcon className="w-3 h-3" />
  {status.label}
</span>

// Sin ícono — usado en tablas
<span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
  {status.label}
</span>
```

### Badge de número de documento

```tsx
<div className="inline-flex items-center gap-1.5 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-3 py-1.5">
  <Hash className="w-3.5 h-3.5 text-[#6C47FF]" />
  <span className="text-lg font-bold text-[#6C47FF]">{number || "Auto"}</span>
</div>
```

> Usa `rounded-lg` (rectangular), no `rounded-full`. Los números de documento son contexto financiero, no pills de categoría.

### Badge de conteo (en SectionHeader)

```tsx
<span className="text-xs font-semibold text-[#6C47FF] bg-[#6C47FF]/10 px-2 py-0.5 rounded-full ml-1">
  {count}
</span>
```

### Cinta diagonal de estado (en documentos impresos)

```tsx
// En pantalla — diagonal con rotate
<div className={`absolute top-6 -left-12 transform -rotate-45 ${status.ribbon} text-white py-1 px-16 text-xs font-bold tracking-widest shadow-md print:hidden`}>
  {status.label.toUpperCase()}
</div>

// En impresión — barra horizontal simple
<div className={`hidden print:block ${status.ribbon} text-white text-xs font-bold tracking-widest py-1 text-center`}>
  {status.label.toUpperCase()}
</div>
```

---

## 6. 💰 Card de Totales

Patrón único para todos los resúmenes financieros. El área del total siempre tiene fondo de marca.

```tsx
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden w-full md:w-72">
  {/* Líneas de detalle */}
  <div className="px-5 py-4 space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">Subtotal</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">$ 0.00</span>
    </div>
    {/* Descuento — solo si > 0 */}
    {discountTotal > 0 && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Descuentos</span>
        <span className="font-medium text-red-500">− $ {fmt(discountTotal)}</span>
      </div>
    )}
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">Impuestos</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">$ 0.00</span>
    </div>
  </div>
  {/* Zona de total — siempre fondo de marca */}
  <div className="px-5 py-4 bg-[#6C47FF]/5 border-t border-[#6C47FF]/15 flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total</span>
    <span className="text-2xl font-bold text-[#6C47FF]">$ 0.00</span>
  </div>
</div>
```

> **Regla:** El total nunca es `text-slate-800`. Siempre `text-[#6C47FF]`. Es el elemento más importante de la pantalla.

---

## 7. 📊 Cards de Resumen (Summary Cards)

Para vistas de detalle financiero (como `BillPreview`), los KPIs se muestran en un grid de cards.

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { label: "Valor total", value: fmt(total),  color: "text-slate-800 dark:text-slate-100" },
    { label: "Retenido",    value: "0.00",      color: "text-amber-500"   },
    { label: "Cobrado",     value: fmt(cobrado), color: "text-emerald-500" },
    { label: "Por cobrar",  value: fmt(porCobrar), color: "text-violet-500" },
  ].map(({ label, value, color }) => (
    <SectionCard key={label} className="px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>$ {value}</p>
    </SectionCard>
  ))}
</div>
```

---

## 8. 📊 Tablas

```
thead:  bg-slate-50/80 dark:bg-slate-800/40
        text-xs font-medium text-slate-500 dark:text-slate-400
        SIN uppercase (look más moderno)
tbody:  hover:bg-slate-50/60 dark:hover:bg-slate-800/30
        divide-y divide-slate-100 dark:divide-slate-800
card:   rounded-2xl overflow-hidden, border border-slate-200 dark:border-slate-800
```

### Botón de eliminar fila (en tablas editables)

```tsx
<button
  onClick={() => removeItem(id)}
  disabled={items.length === 1}
  className="w-7 h-7 rounded-lg flex items-center justify-center
    text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
    transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
>
  <X className="w-3.5 h-3.5" />
</button>
```

### Botón "Agregar línea" (footer de tabla)

```tsx
<div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
  <button
    onClick={addItem}
    className="flex items-center gap-1.5 text-sm font-medium text-[#6C47FF] hover:text-[#5835E8] transition-colors"
  >
    <div className="w-5 h-5 rounded-md bg-[#6C47FF]/10 flex items-center justify-center">
      <Plus className="w-3 h-3" />
    </div>
    Agregar línea
  </button>
</div>
```

---

## 9. 📎 Upload de Archivos (Logo / Firma)

```tsx
<input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handler} />
<button
  onClick={() => isEditable && inputRef.current?.click()}
  className={`group relative flex items-center justify-center
    border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl
    transition-colors overflow-hidden
    ${isEditable ? "hover:border-[#6C47FF]/40 cursor-pointer" : "cursor-default"}
    ${fileUrl ? "border-none" : ""}`}
>
  {fileUrl ? (
    <>
      <img src={fileUrl} alt="Preview" className="w-full h-full object-contain" />
      {isEditable && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
          <Upload className="w-4 h-4 text-white" />
        </div>
      )}
    </>
  ) : (
    <div className={`flex flex-col items-center gap-1.5 text-slate-400 transition-colors ${isEditable ? "group-hover:text-[#6C47FF]" : ""}`}>
      <IconoRelevante className="w-5 h-5" />
      <span className="text-xs font-medium">Etiqueta</span>
      <span className="text-xs text-slate-300">.png o .jpg</span>
    </div>
  )}
</button>
```

> **Regla:** El hover de la zona de upload siempre muestra un overlay `bg-black/40` con ícono blanco centrado. El borde en hover es `border-[#6C47FF]/40`. Nunca un borde azul genérico.

---

## 10. 🔔 Alertas / Banners de Error

### Error crítico (ej: rechazo DIAN)

```tsx
<div className="flex items-start gap-4 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
    <XCircle className="w-4 h-4 text-red-600" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-red-800 dark:text-red-300">Título del error</p>
    <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">Descripción del problema.</p>
    {/* Link de acción opcional */}
    <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900 transition-colors">
      <Terminal className="w-3.5 h-3.5" />
      Ver detalles técnicos
    </button>
  </div>
</div>
```

### Informativo (acento de marca)

```tsx
<div className="flex items-start gap-3 bg-[#6C47FF]/8 border border-[#6C47FF]/20 rounded-lg px-4 py-3">
  <Info className="w-4 h-4 text-[#6C47FF] shrink-0 mt-0.5" />
  <p className="text-sm text-[#6C47FF] dark:text-[#8B6EFF]">Mensaje informativo aquí.</p>
</div>
```

### Empty state neutro

```tsx
<div className="flex items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-8 py-8 text-sm text-slate-500">
  <Info className="w-4 h-4 shrink-0" />
  No hay registros para mostrar.
</div>
```

---

## 11. 🖥️ Modal Técnico (Terminal / Dark)

Para modales de contenido técnico (respuestas de API, logs, JSON).

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
  <div className="bg-zinc-900 text-zinc-100 border border-zinc-800 w-full max-w-2xl shadow-2xl rounded-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
    {/* Header */}
    <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Título del Modal</h3>
      </div>
      <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
    {/* Body */}
    <div className="p-6 overflow-y-auto space-y-4">
      <div className="bg-black/50 rounded-xl p-4 border border-zinc-800 font-mono text-xs leading-relaxed text-zinc-300">
        <pre className="whitespace-pre-wrap break-all">{content}</pre>
      </div>
      <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
        <Info className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">Nota contextual aquí.</p>
      </div>
    </div>
    {/* Footer */}
    <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
      <button onClick={onClose} className="h-9 px-5 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
        Entendido
      </button>
    </div>
  </div>
</div>
```

---

## 12. 🔁 Tab Toggles (Segmentados)

```tsx
<div className="flex gap-2 p-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
  <button className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
    active
      ? "bg-white dark:bg-slate-800 text-[#6C47FF] shadow-sm border border-slate-200 dark:border-slate-700"
      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
  }`}>
    Opción A
  </button>
</div>
```

---

## 13. 🔘 Botones — Referencia rápida

| Variante    | Clases clave                                                                 | Uso                          |
| ----------- | ---------------------------------------------------------------------------- | ----------------------------- |
| Primario    | `bg-[#6C47FF] hover:bg-[#5835E8] text-white shadow-sm shadow-[#6C47FF]/25` | CTA principal                |
| Secundario  | `border border-slate-200 dark:border-slate-700 hover:bg-slate-50`           | Acciones auxiliares          |
| Destructivo | `bg-red-500 hover:bg-red-600 text-white`                                    | Eliminar / cancelar          |
| Ghost       | `hover:bg-slate-100 dark:hover:bg-slate-800`                                | Acciones discretas           |

- **Navbar:** `h-8`, ícono `w-3.5 h-3.5`, gap `gap-1.5`
- **Página / footer:** `h-9`, ícono `w-4 h-4`, gap `gap-2`
- **`disabled`:** siempre `disabled:opacity-40 disabled:cursor-not-allowed`

---

## 14. 🧩 Divisores con Etiqueta

```tsx
<div className="relative flex items-center">
  <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
  <span className="mx-3 text-xs font-medium text-slate-500 uppercase tracking-widest">
    Sección
  </span>
  <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
</div>
```

---

## 15. 🌗 Dark Mode

| Superficie      | Light                   | Dark                    |
| --------------- | ----------------------- | ----------------------- |
| Página          | `slate-50` (`#f8fafc`)  | `slate-950` (`#020617`) |
| Card            | `white` (`#ffffff`)     | `slate-900` (`#0f172a`) |
| Borde base      | `slate-200` (`#e2e8f0`) | `slate-800` (`#1e293b`) |
| Borde inner     | `slate-100` (`#f1f5f9`) | `slate-800` (`#1e293b`) |
| Input / Elevado | `white`                 | `slate-800` (`#1e293b`) |
| Navbar          | `white/80`              | `slate-900/80`          |

---

## 16. ✅ Checklist antes de mergear un componente

### Layout
- [ ] Formularios y vistas de detalle usan navbar sticky con `backdrop-blur-md` + `h-14`
- [ ] El fondo de página es `bg-slate-50` / `bg-slate-950`
- [ ] Los cards usan `rounded-2xl` + `border-slate-200/800` + `shadow-sm`
- [ ] Máximo ancho de contenido: `max-w-6xl mx-auto`

### Tipografía y labels
- [ ] Labels de campo: `text-xs font-medium uppercase tracking-wide`
- [ ] Sub-headers de sección dentro de card: `text-xs font-semibold uppercase tracking-wide text-slate-500`
- [ ] El asterisco `*` de campo requerido es `text-[#6C47FF]` (no rojo)

### Controles
- [ ] Inputs y selects usan `rounded-lg` y focus ring `ring-[#6C47FF]/30 border-[#6C47FF]`
- [ ] Selects tienen wrapper con `ChevronDown` custom — nunca flecha nativa del browser
- [ ] Controles deshabilitados tienen `disabled:opacity-60 disabled:cursor-not-allowed`

### Marca y color
- [ ] Botón primario: `bg-[#6C47FF] hover:bg-[#5835E8] shadow-sm shadow-[#6C47FF]/25`
- [ ] Card de totales: zona total con `bg-[#6C47FF]/5` y monto en `text-[#6C47FF]`
- [ ] Badge de número: `bg-[#6C47FF]/8 border-[#6C47FF]/20 rounded-lg`
- [ ] Ícono de SectionHeader: wrapper `bg-[#6C47FF]/10` + ícono `text-[#6C47FF]`

### Estados
- [ ] Los estados de entidad usan `statusConfig` centralizado (label + badge + ribbon + icon)
- [ ] Los pills de estado en navbar llevan ícono; en tablas, sin ícono

### Tablas
- [ ] Headers de tabla SIN `uppercase` — solo `font-medium text-slate-500`
- [ ] Hover de fila: `hover:bg-slate-50/60 dark:hover:bg-slate-800/30`
- [ ] Botón eliminar fila: hover rojo sutil + `disabled:opacity-30`

### Impresión
- [ ] La cinta diagonal de estado usa `print:hidden` y la versión horizontal `hidden print:block`
- [ ] Elementos de UI (navbar, botones, cards de resumen) llevan `print:hidden`
- [ ] El documento principal lleva `print:border-none print:shadow-none`

### General
- [ ] No hay `#5037ec`, `#6438F0`, `bg-teal-*`, `text-primary` hardcodeados
- [ ] Los átomos (`SectionCard`, `SectionHeader`, `FieldLabel`, etc.) se importan desde el archivo compartido, no se redefinen