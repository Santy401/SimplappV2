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
| **Brand Subtle BG** | `--brand-subtle-bg`     | `#6C47FF12`  | `bg-brand-subtle-bg`         | Fondo de alerts, banners, empty states |
| **Brand Border**    | `--brand-subtle-border` | `#6C47FF25`  | `border-brand-subtle-border` | Borde de cards con acento de marca     |
| **Brand Text**      | `--brand-foreground`    | `#ffffff`    | `text-brand-foreground`      | Texto/ícono sobre botón de marca       |

> 🎯 **Regla de oro:** Nunca uses `#6C47FF` hardcodeado en el código. Usa siempre las clases de Tailwind: `bg-brand`, `text-brand`, `hover:bg-brand-hover`. Las variables CSS se definen únicamente en `apps/web/app/globals.css`.

> 💡 **¿Cómo se ve?** Es el violeta vivo que aparece en los botones "+ Nuevo elemento" del Storybook en dark mode. Vibrante, no apagado.

### Superficies (Backgrounds)

| Nombre          | Light     | Dark      | Uso                                     |
| --------------- | --------- | --------- | --------------------------------------- |
| **Page BG**     | `#F5F7FB` | `#0C0C0C` | Fondo de página, fondo de tablas, pills |
| **Card BG**     | `#ffffff` | `#141414` | Tarjetas, modales, formularios          |
| **Elevated BG** | `#ffffff` | `#262626` | Tab activo, inputs elevados, tooltips   |
| **Inner BG**    | `#F5F7FB` | `#1a1a1a` | Filas hover, totales, headers de tabla  |

### Bordes

| Nombre          | Light  | Dark      | Uso                                        |
| --------------- | ------ | --------- | ------------------------------------------ |
| **Border Base** | `#ddd` | `#2d2d2d` | Bordes de cards, tablas, inputs, divisores |

> ✅ Usa las **clases de Tailwind derivadas de CSS variables** (`bg-brand`, `text-brand`, `bg-brand-subtle-bg`) en lugar de `bg-[#6438F0]` o variables directas. Tailwind las traduce automáticamente a las variables CSS.

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

Los formularios de alta complejidad (como "Nuevo pago recibido" o "Nueva factura") usan un layout de **página completa**, no overlay. Esto da más espacio y no interrumpe el flujo.

### Estructura obligatoria

```
[Page BG: #F5F7FB / #0C0C0C]
  ↳ [Título de página con ícono de acento]
  ↳ [Card principal: bg-white / #141414+ border + rounded-xl + shadow-sm]
       ↳ [Header del documento] — borde inferior, compañía + badge No.X
       ↳ [Body del formulario] — grid de campos
       ↳ [Footer de acciones] — borde superior, botones a la derecha
```

### Reglas de Cards

```tsx
// ✅ Correcto
<div className="bg-white dark:bg-[#141414] border border-[#ddd] dark:border-[#2d2d2d] rounded-xl shadow-sm">

// ❌ Evitar — borde demasiado pronunciado, no es nuestra paleta
<div className="bg-card border border-border rounded-2xl shadow-lg">
```

### Header del documento (recibos, facturas)

- Lado izquierdo: nombre empresa + subtítulo en gris
- Lado derecho: badge con número (`No. X`) en color de marca + link discreto
- Separado del body con `border-b border-[#ddd] dark:border-[#2d2d2d]`

---

## 4. 🔘 Botones

### Primario — Acción principal (CTA)

El botón primario usa el **color de marca** y viene configurado en la variante `default` y `WithIcon`:

```tsx
// ✅ Sin icón — variante default
<Button>Guardar</Button>

// ✅ Con icón — variante WithIcon (semánticamente indica que lleva ícono)
<Button variant="WithIcon">
  <PlusIcon className="w-4 h-4" />
  Nueva Factura
</Button>

// Ambas variantes usan bg-brand automáticamente — °un className extra!
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

- **Altura estándar:** `h-9` (36px). Solo `h-8` en contextos muy comprimidos.
- **Texto:** siempre `text-sm font-medium`. Sin mayúsculas forzadas.
- **Framer Motion:** El `Button` ya incluye `whileTap={{ scale: 0.91 }}`. No agregar animaciones encima.
- **Icóno + texto:** `gap-2`, icóno de `w-4 h-4`. Usar `variant="WithIcon"` cuando lleve icóno.
- ❌ **Nunca** usar `bg-teal-500`, `bg-green-600`, `bg-[#5037ec]`, ni `bg-[#6C47FF]` hardcodeados.

---

## 5. 🏷️ Labels de Formulario

```tsx
// ✅ Estilo Simplapp — uppercase + tracking
<Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
  Fecha de pago
</Label>

// ❌ Estilo genérico — no diferencia a Simplapp
<Label>Fecha de pago</Label>
```

Los campos **obligatorios** usan:

```tsx
<span className="text-brand font-bold leading-none">*</span>
```

— No `text-destructive` (rojo). El asterisco de Simplapp es del color de marca.

---

## 6. 🔁 Tab Toggles (Segmentados)

Para alternar entre vistas o modos dentro de una sección, se usa el **pill toggle** de Simplapp:

```tsx
<div className="flex gap-2 p-1 rounded-lg bg-[#F5F7FB] dark:bg-[#1a1a1a] border border-[#ddd] dark:border-[#2d2d2d]">
  <button
    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
      active
        ? "bg-white dark:bg-[#262626] text-brand shadow-sm border border-[#ddd] dark:border-[#2d2d2d]"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    Opción A
  </button>
  {/* ... */}
</div>
```

### Distinguiendo de Alegra

| Característica | Alegra                       | **Simplapp**                                 |
| -------------- | ---------------------------- | -------------------------------------------- |
| Tab activo     | Fondo blanco liso, sin borde | Fondo blanco + borde + `text-brand`          |
| Tab inactivo   | Gris claro                   | `text-muted-foreground` que responde al tema |
| Contenedor     | Sin padding, borde simple    | `p-1`, fondo `#F5F7FB`, borde visible        |

---

## 7. 🔔 Alertas y Empty States

### Empty state con acento de marca (informativo)

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
<div className="flex items-center gap-3 border border-dashed border-[#ddd] dark:border-[#2d2d2d] rounded-lg px-4 py-4 text-sm text-muted-foreground">
  <Info className="w-4 h-4 shrink-0" />
  No hay registros para mostrar.
</div>
```

---

## 8. 📊 Tablas

```
header: bg-[#F5F7FB] / #1a1a1a, text uppercase tracking-wide
filas:  hover:bg-[#F5F7FB] / #1a1a1a, divide-y divide-[#ddd] / #2d2d2d
borde contenedor: border border-[#ddd] / #2d2d2d, rounded-lg, overflow-hidden
```

- Los headers usan el mismo estilo que los labels de formulario: `text-xs font-medium uppercase tracking-wide text-muted-foreground`.
- Sin líneas de separación verticales entre columnas.
- El `hover` de fila usa el mismo color que el fondo de página (`#F5F7FB`).

---

## 9. 🏅 Badges / Chips

```tsx
// Badge de número de documento
<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-brand-light bg-brand-subtle-bg px-2.5 py-0.5 rounded-full">
  No. 7
</span>
```

- Forma: `rounded-full` (píldora).
- Colores: `text-brand` + `bg-brand-subtle-bg` — siempre desde las variables CSS.
- Tamaño texto: `text-xs font-semibold`.

---

## 10. 🧩 Divisores con Etiqueta

Para separar secciones dentro de un formulario:

```tsx
<div className="relative flex items-center">
  <div className="flex-1 border-t border-[#ddd] dark:border-[#2d2d2d]" />
  <span className="mx-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">
    Sección
  </span>
  <div className="flex-1 border-t border-[#ddd] dark:border-[#2d2d2d]" />
</div>
```

---

## 11. 🌗 Dark Mode

El dark mode de Simplapp es **oscuro real** (`#0C0C0C`), no gris oscuro.

| Superficie         | Light     | Dark      |
| ------------------ | --------- | --------- |
| Página             | `#F5F7FB` | `#0C0C0C` |
| Card               | `#ffffff` | `#141414` |
| Borde              | `#ddd`    | `#2d2d2d` |
| Elevado            | `#F5F7FB` | `#1a1a1a` |
| Input / Tab activo | `#ffffff` | `#262626` |

Nunca uses `bg-card`, `bg-muted` para superficies principales — usa las variables hex directas documentadas aquí para mantener consistencia.

---

## 12. ✅ Checklist antes de mergear un componente

- [ ] Los labels usan `text-xs font-medium uppercase tracking-wide`
- [ ] El botón primario usa `variant="default"` o `variant="WithIcon"` (nunca `bg-[#6C47FF]` directo)
- [ ] El asterisco de campo requerido es `text-brand` (no rojo)
- [ ] El fondo de página es `#F5F7FB` / `#0C0C0C`
- [ ] Los bordes son `#ddd` / `#2d2d2d`
- [ ] Los tab toggles tienen `p-1` + borde en el contenedor
- [ ] El empty state informativo usa `bg-brand-subtle-bg` con icóno `text-brand`
- [ ] El ícono del título de página tiene fondo `bg-brand-subtle-bg` con el icóno en `text-brand`
- [ ] No hay ningún `#5037ec`, `#6438F0`, `#6C47FF`, `bg-teal-*` hardcodeado en el componente
