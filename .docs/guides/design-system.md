# Guía de Estilo — Simplapp Design System

Este documento define la identidad visual de **Simplapp** y cómo aplicarla de manera consistente en todos los componentes: modales, formularios, dashboard, botones, tablas y estados vacíos.

> **Regla de oro:** Simplapp no es Alegra, no es Notion, no es Linear. Tiene su propio lenguaje. Cuando dudes, consulta este documento antes de copiar un estilo externo.

---

## 1. 🎨 Paleta de Colores

### Color de Marca (Brand)

El color de Simplapp es un **violeta-azulado vibrante** (`#6C47FF`) — el tono exacto que ves en los botones primarios, badges y elementos de acción del producto. En dark mode se aclara a `#8B6EFF` para mantener contraste y luminosidad.

| Nombre              | CSS Variable            | Valor        | Tailwind class               | Uso                                    |
| ------------------- | ----------------------- | ------------ | ---------------------------- | -------------------------------------- |
| **Brand Primary**   | `--brand`               | `#6C47FF` ⭐ | `bg-brand` / `text-brand`    | Botón primario, ícono de acción        |
| **Brand Hover**     | `--brand-hover`         | `#5835E8`    | `hover:bg-brand-hover`       | Estado hover del botón primario        |
| **Brand Light**     | `--brand-light`         | `#8B6EFF`    | `text-brand-light`           | Textos sobre fondo oscuro (dark mode)  |
| **Brand Subtle BG** | `--brand-subtle-bg`     | `#6C47FF12`  | `bg-brand-subtle-bg`         | Fondo de alerts, banners, empty states, icon wrappers |
| **Brand Border**    | `--brand-subtle-border` | `#6C47FF25`  | `border-brand-subtle-border` | Borde de cards con acento de marca, total highlight |
| **Brand Text**      | `--brand-foreground`    | `#ffffff`    | `text-brand-foreground`      | Texto/ícono sobre botón de marca       |

> 🎯 **Regla de oro:** Nunca uses `#6C47FF` hardcodeado en el código. Usa siempre las clases de Tailwind: `bg-brand`, `text-brand`, `hover:bg-brand-hover`. Las variables CSS se definen únicamente en `apps/web/app/globals.css`.

> 💡 **¿Cómo se ve?** Es el violeta vivo que aparece en los botones "+ Nuevo elemento" del Storybook en dark mode. Vibrante, no apagado.

### Superficies (Backgrounds)

| Nombre          | Light                  | Dark                    | Uso                                     |
| --------------- | ---------------------- | ----------------------- | --------------------------------------- |
| **Page BG**     | `slate-50` (`#f8fafc`) | `slate-950` (`#020617`) | Fondo de página, fondo de tablas, pills |
| **Card BG**     | `white` (`#ffffff`)    | `slate-900` (`#0f172a`) | Tarjetas, modales, formularios          |
| **Elevated BG** | `white` (`#ffffff`)    | `slate-800` (`#1e293b`) | Tab activo, inputs elevados, tooltips   |
| **Inner BG**    | `slate-50/50`          | `slate-900/50`          | Filas hover, totales, headers de tabla  |

### Bordes

| Nombre          | Light                   | Dark                    | Uso                                        |
| --------------- | ----------------------- | ----------------------- | ------------------------------------------ |
| **Border Base** | `slate-200` (`#e2e8f0`) | `slate-800` (`#1e293b`) | Bordes de cards, tablas, inputs, divisores |
| **Border Inner**| `slate-100` (`#f1f5f9`) | `slate-800` (`#1e293b`) | Divisores internos dentro de un card       |

> ✅ Usa las **clases de Tailwind derivadas de CSS variables** (`bg-brand`, `text-brand`, `bg-brand-subtle-bg`) en lugar de `bg-[#6438F0]` o variables directas.

---

## 2. 🔤 Tipografía

Simplapp usa **Geist Sans** (vía `--font-geist-sans`).

### Escala de labels en formularios y tablas

```
text-xs font-medium uppercase tracking-wide text-muted-foreground
```

— Esta es la **firma tipográfica de Simplapp**. Diferencia nuestros formularios de cualquier competidor.

### Jerarquía

| Elemento              | Clases                                                              |
| --------------------- | ------------------------------------------------------------------- |
| Título de página      | `text-xl font-semibold text-foreground tracking-tight`              |
| Título de sección     | `text-sm font-semibold text-foreground`                             |
| Label de campo        | `text-xs font-medium uppercase tracking-wide text-muted-foreground` |
| Texto de cuerpo       | `text-sm text-foreground`                                           |
| Texto secundario      | `text-sm text-muted-foreground`                                     |
| Texto de badge / chip | `text-xs font-semibold`                                             |

---

## 3. 🪟 Modales y Formularios de Página Completa

Los formularios de alta complejidad (como "Nuevo pago recibido" o "Nueva factura") usan un layout de **página completa con barra sticky**, no overlay. Esto da más espacio y no interrumpe el flujo.

### Estructura obligatoria

```
[Sticky Nav Bar: bg-white/80 backdrop-blur-md border-b]
  ↳ [Volver] [Separador] [Título + Badge de estado]   [Acciones flotantes →]

[Page BG: slate-50 / slate-950, py-8]
  ↳ [SectionCard: configuración meta]
  ↳ [SectionCard: header del documento — logo, número, cliente, fechas]
  ↳ [SectionCard: tabla de ítems con footer "Agregar línea"]
  ↳ [Row: firma (izquierda) + card de totales (derecha)]
  ↳ [SectionCard: notas y condiciones]
  ↳ [Row de acciones finales]
```

### Barra de navegación sticky

```tsx
// ✅ Patrón obligatorio para formularios de página completa
<div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
  <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
    {/* Izquierda: back + título */}
    <div className="flex items-center gap-3">
      <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver</span>
      </button>
      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-brand" />
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Nueva Factura</span>
        <StatusBadge status={formData.status} />
      </div>
    </div>
    {/* Derecha: acciones */}
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">...</Button>
      <Button variant="WithIcon" size="sm">Emitir factura</Button>
    </div>
  </div>
</div>
```

### SectionCard — Card de Sección

Todos los bloques de contenido dentro de un formulario de página completa usan `SectionCard`. El patrón es:

```tsx
// ✅ Correcto — rounded-2xl, shadow-sm, borde sutil
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
  {/* Header de sección (opcional pero recomendado) */}
  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
    <div className="w-6 h-6 rounded-md bg-brand-subtle-bg flex items-center justify-center">
      <IconoRelevante className="w-3.5 h-3.5 text-brand" />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Título de sección</span>
  </div>
  {/* Body */}
  <div className="px-6 py-5">
    {/* contenido */}
  </div>
</div>

// ❌ Evitar — rounded-xl sin header, bordes genéricos
<div className="bg-card border border-[#ddd] rounded-xl shadow-sm">
```

> 🆕 **Cambio respecto a la versión anterior:** Se usa `rounded-2xl` (no `rounded-xl`) para un look más moderno y suave. Los headers de sección llevan siempre un ícono con wrapper `bg-brand-subtle-bg`.

### Header del documento (facturas, recibos)

```tsx
// Estructura en 3 columnas: logo | marca central | número
<div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-6">
  {/* Logo upload */}
  <button className="group relative flex items-center justify-center border-2 border-dashed
    border-slate-200 dark:border-slate-700 rounded-xl hover:border-brand/50 transition-colors
    overflow-hidden w-36 h-20">
    {/* contenido */}
  </button>

  {/* Centro */}
  <div className="flex-1 text-center">
    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Simplapp</p>
    <p className="text-xs text-slate-400 mt-0.5">Factura de Venta</p>
  </div>

  {/* Número — badge de marca */}
  <div className="text-right">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Número</p>
    <div className="inline-flex items-center gap-1.5 bg-brand-subtle-bg border border-brand-subtle-border rounded-lg px-3 py-1.5">
      <Hash className="w-3.5 h-3.5 text-brand" />
      <span className="text-lg font-bold text-brand">Auto</span>
    </div>
  </div>
</div>
```

---

## 4. 🔘 Botones

### Primario — Acción principal (CTA)

```tsx
// ✅ Sin ícono — variante default
<Button>Guardar</Button>

// ✅ Con ícono — variante WithIcon
<Button variant="WithIcon">
  <Send className="w-4 h-4" />
  Emitir factura
</Button>
```

### Secundario — Cancelar / acción auxiliar

```tsx
<Button variant="outline" className="h-9 px-4 text-sm">
  Cancelar
</Button>
```

### Destructivo

```tsx
<Button variant="destructive" className="h-9 px-4 text-sm">
  Eliminar
</Button>
```

### Resumen de variantes disponibles

| Variante      | Uso                                            | Clase auto                                 |
| ------------- | ---------------------------------------------- | ------------------------------------------ |
| `default`     | Acción primaria (guardar, confirmar)           | `bg-brand hover:bg-brand-hover text-white` |
| `WithIcon`    | Acción primaria con ícono (nueva factura, etc) | `bg-brand hover:bg-brand-hover text-white` |
| `outline`     | Acción secundaria (cancelar, exportar)         | `border bg-background`                     |
| `destructive` | Eliminar, anular, archivar                     | `bg-destructive text-white`                |
| `ghost`       | Acción discreta en toolbars                    | `hover:bg-accent`                          |
| `link`        | Navegación en texto                            | `underline`                                |

### Reglas de botones

- **Altura estándar:** `h-9` (36px). Solo `h-8` en contextos de navbar/toolbar comprimidos.
- **Texto:** siempre `text-sm font-medium`. Sin mayúsculas forzadas.
- **Icóno + texto:** `gap-1.5` en navbar, `gap-2` en body. Ícono de `w-3.5 h-3.5` en navbar, `w-4 h-4` en body.
- **Sombra en botón primario:** `shadow-sm shadow-brand/25` para dar profundidad sin exagerar.
- ❌ **Nunca** usar `bg-teal-500`, `bg-green-600`, `bg-[#5037ec]`, ni `bg-[#6C47FF]` hardcodeados.

### Botón "Agregar línea" (en tablas)

Patrón especial para agregar filas dentro de tablas de ítems:

```tsx
<button
  onClick={addItem}
  className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
>
  <div className="w-5 h-5 rounded-md bg-brand-subtle-bg flex items-center justify-center">
    <Plus className="w-3 h-3" />
  </div>
  Agregar línea
</button>
```

---

## 5. 🏷️ Labels de Formulario

```tsx
// ✅ Estilo Simplapp — uppercase + tracking
<label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
  Fecha de pago
</label>

// ❌ Estilo genérico
<Label>Fecha de pago</Label>
```

Los campos **obligatorios** usan:

```tsx
<span className="ml-1 text-brand font-bold leading-none">*</span>
```

— No `text-destructive` (rojo). El asterisco de Simplapp es del color de marca.

---

## 6. 🔡 Inputs, Selects y Textareas

Todos los controles de formulario comparten la misma firma visual. Se recomienda encapsularlos en componentes atómicos.

### Input

```tsx
// Firma visual de inputs en Simplapp
<input className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700
  bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
  placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
  transition-all" />
```

### Select

Los selects siempre usan un wrapper para reemplazar el chevron nativo del browser:

```tsx
<div className="relative">
  <select className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
    focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
    appearance-none transition-all">
    {/* opciones */}
  </select>
  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
</div>
```

### Textarea

```tsx
<textarea className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700
  bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100
  placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
  transition-all resize-none" />
```

### Reglas generales de controles

- **Border radius:** `rounded-lg` (no `rounded-md`). Más suave y moderno.
- **Height:** `h-9` estándar. Solo `h-8` en celdas de tabla comprimidas.
- **Focus ring:** siempre `ring-brand/30` + `border-brand`. Nunca anillo azul genérico.
- **Dark mode bg:** `dark:bg-slate-800` (elevated), nunca `dark:bg-slate-900` en inputs.

---

## 7. 🔁 Tab Toggles (Segmentados)

```tsx
<div className="flex gap-2 p-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
  <button
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
      active
        ? "bg-white dark:bg-slate-800 text-brand shadow-sm border border-slate-200 dark:border-slate-700"
        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
    }`}
  >
    Opción A
  </button>
</div>
```

---

## 8. 🔔 Alertas y Empty States

### Empty state informativo (con acento de marca)

```tsx
<div className="flex items-start gap-3 bg-brand-subtle-bg border border-brand-subtle-border rounded-lg px-4 py-3">
  <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
  <p className="text-sm text-brand dark:text-brand-light">
    Mensaje informativo aquí.
  </p>
</div>
```

### Empty state neutro (sin datos)

```tsx
<div className="flex items-center gap-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl px-8 py-8 text-sm text-slate-500">
  <Info className="w-4 h-4 shrink-0" />
  No hay registros para mostrar.
</div>
```

---

## 9. 📊 Tablas

```
header: bg-slate-50/80 dark:bg-slate-800/40
        text-xs font-medium text-slate-500 dark:text-slate-400
        (sin uppercase — look más moderno para tablas)
filas:  hover:bg-slate-50/60 dark:hover:bg-slate-800/30
        divide-y divide-slate-100 dark:divide-slate-800
borde:  border border-slate-200 dark:border-slate-800
        rounded-2xl overflow-hidden
```

### Botón de eliminar fila

```tsx
<button
  onClick={() => removeItem(item.id)}
  disabled={items.length === 1}
  className="w-7 h-7 rounded-lg flex items-center justify-center
    text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
    transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
>
  <X className="w-3.5 h-3.5" />
</button>
```

> 🆕 **Cambio:** Los headers de tabla ya no usan `uppercase`. Se prefiere `text-slate-500 font-medium` sin transform para un look más limpio y contemporáneo.

---

## 10. 💰 Card de Totales

El resumen de totales en documentos financieros tiene un patrón específico:

```tsx
<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden w-72">
  {/* Líneas de detalle */}
  <div className="px-5 py-4 space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">Subtotal</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">$ 0.00</span>
    </div>
    {/* Descuento — solo renderizar si > 0 */}
    {discount > 0 && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Descuento</span>
        <span className="font-medium text-red-500">− $ {discount}</span>
      </div>
    )}
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">Impuestos</span>
      <span className="font-medium text-slate-700 dark:text-slate-300">$ 0.00</span>
    </div>
  </div>
  {/* Total — fondo de marca sutil */}
  <div className="px-5 py-4 bg-brand-subtle-bg border-t border-brand-subtle-border flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total</span>
    <span className="text-2xl font-bold text-brand">$ 0.00</span>
  </div>
</div>
```

> 🆕 **Patrón nuevo:** El total siempre tiene su propia zona con `bg-brand-subtle-bg` y el monto en `text-brand`. Esto lo diferencia claramente del resto de líneas.

---

## 11. 🏅 Badges / Chips

### Badge de número de documento

```tsx
<div className="inline-flex items-center gap-1.5 bg-brand-subtle-bg border border-brand-subtle-border rounded-lg px-3 py-1.5">
  <Hash className="w-3.5 h-3.5 text-brand" />
  <span className="text-lg font-bold text-brand">Auto</span>
</div>
```

> 🆕 **Cambio:** Los números de documento usan `rounded-lg` (rectangular) en lugar de `rounded-full`. Más sobrio para contextos financieros.

### Badge de estado (BillStatus)

```tsx
const statusColors: Record<BillStatus, string> = {
  DRAFT:          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  ISSUED:         "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  PAID:           "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  PARTIALLY_PAID: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED:      "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  TO_PAY:         "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
};

<span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[status]}`}>
  {label}
</span>
```

### Badge de conteo (en headers de sección)

```tsx
<span className="text-xs font-semibold text-brand bg-brand-subtle-bg px-2 py-0.5 rounded-full">
  {items.length}
</span>
```

---

## 12. 📎 Upload de archivos (Logo / Firma)

Patrón unificado para zonas de drop/click de archivos:

```tsx
<button
  onClick={() => inputRef.current?.click()}
  className={`group relative flex items-center justify-center
    border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl
    hover:border-brand/40 transition-colors overflow-hidden
    ${hasFile ? "border-none" : ""}`}
>
  {hasFile ? (
    <>
      <img src={fileUrl} alt="Preview" className="w-full h-full object-contain" />
      {/* Overlay hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
        flex items-center justify-center transition-opacity rounded-xl">
        <Upload className="w-4 h-4 text-white" />
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center gap-1.5 text-slate-400
      group-hover:text-brand transition-colors">
      <IconoRelevante className="w-5 h-5" />
      <span className="text-xs font-medium">Etiqueta</span>
      <span className="text-xs text-slate-300">.png o .jpg</span>
    </div>
  )}
</button>
```

---

## 13. 🧩 Divisores con Etiqueta

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

## 14. 🌗 Dark Mode

| Superficie         | Light                   | Dark                    |
| ------------------ | ----------------------- | ----------------------- |
| Página             | `slate-50` (`#f8fafc`)  | `slate-950` (`#020617`) |
| Card               | `white` (`#ffffff`)     | `slate-900` (`#0f172a`) |
| Borde base         | `slate-200` (`#e2e8f0`) | `slate-800` (`#1e293b`) |
| Borde inner        | `slate-100` (`#f1f5f9`) | `slate-800` (`#1e293b`) |
| Elevado / Input    | `white`                 | `slate-800` (`#1e293b`) |
| Navbar sticky      | `white/80`              | `slate-900/80`          |

Nunca uses `bg-card`, `bg-muted` para superficies principales — usa las variables hex documentadas aquí.

---

## 15. ✅ Checklist antes de mergear un componente

- [ ] Los labels usan `text-xs font-medium uppercase tracking-wide`
- [ ] El botón primario usa `variant="default"` o `variant="WithIcon"` (nunca `bg-[#6C47FF]` directo)
- [ ] El asterisco de campo requerido es `text-brand` (no rojo)
- [ ] El fondo de página usa `bg-slate-50` / `bg-slate-950`
- [ ] Los cards usan `rounded-2xl` + `border-slate-200/800` + `shadow-sm`
- [ ] Los headers de sección dentro de cards llevan ícono con wrapper `bg-brand-subtle-bg`
- [ ] Los inputs/selects usan `rounded-lg` y focus ring `ring-brand/30 border-brand`
- [ ] Los selects tienen wrapper con `ChevronDown` custom (no flecha nativa del browser)
- [ ] Los bordes usan `border-slate-200` / `border-slate-800`
- [ ] Formularios de página completa tienen navbar sticky con `backdrop-blur-md`
- [ ] El card de totales usa `bg-brand-subtle-bg` + `text-brand` para el total final
- [ ] Los headers de tabla NO usan `uppercase` — solo `text-slate-500 font-medium`
- [ ] Los tab toggles tienen `p-1` + borde en el contenedor
- [ ] El empty state informativo usa `bg-brand-subtle-bg` con ícono `text-brand`
- [ ] No hay ningún `#5037ec`, `#6438F0`, `#6C47FF`, `bg-teal-*` hardcodeado en el componente