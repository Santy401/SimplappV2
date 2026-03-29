# Refactor de Animaciones - Plan de Implementación

## Overview

Optimizar el sistema de animaciones del proyecto, migrando de `framer-motion` a una combinación de **Motion One** y **GSAP** para lograr animaciones más fluidas y con mejor rendimiento.

## Problemas Identificados

| Problema | Gravedad | Archivo |
|----------|----------|---------|
| `framer-motion` + `motion` duplicados | Media | `package.json` |
| Sin `useReducedMotion` (accesibilidad) | Alta | Todos |
| Inline `<style>` con keyframes | Media | `NotificationDropdown.tsx:109-129` |
| Backgrounds animados con `blur` + scale | Alta | `not-found.tsx` |
| Duraciones inconsistentes | Baja | Varios |
| Sin configuración centralizada | Media | - |

## Stack Elegido

| Librería | Uso | Beneficio |
|----------|-----|-----------|
| **Motion One** | Animaciones declarativas en componentes (transiciones, hover, entry) | ~10KB, GPU-accelerated, API moderna |
| **GSAP** | Animaciones complejas (timelines, scroll-triggered, sequences) | Control total, mejor performance |
| **CSS Animations** | Animaciones simples repetitivas (badges, loaders) | Sin JS overhead |

## Arquitectura Final

```
packages/ui/src/
├── utils/
│   ├── animations/
│   │   ├── constants.ts         # Durations, easings, shared config
│   │   ├── variants.ts          # Shared animation variants (motion)
│   │   ├── gsap-presets.ts     # GSAP timelines reutilizables
│   │   └── use-reduced-motion.ts
│   └── gsap.ts                  # GSAP setup con plugins
└── styles/
    └── animations.module.css    # Keyframes extraídos
```

## Dependencias Finales

```json
{
  "dependencies": {
    "motion": "^12.x",
    "gsap": "^3.x"
  },
  "remover": "framer-motion"
}
```

---

## Fase 1 - Configuración Base

### 1.1 Instalar dependencias

```bash
pnpm add motion gsap
pnpm remove framer-motion
```

### 1.2 Crear `packages/ui/src/utils/animations/constants.ts`

```typescript
export const ANIMATION = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    slower: 0.6,
  },
  ease: {
    standard: [0.23, 1, 0.32, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    spring: { stiffness: 300, damping: 25 } as const,
    springBouncy: { stiffness: 400, damping: 20 } as const,
  },
} as const;

export const STAGGER = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;
```

### 1.3 Crear `packages/ui/src/utils/animations/variants.ts`

```typescript
import { ANIMATION, STAGGER } from './constants';

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const getStaggerChildren = (index: number, baseDelay = STAGGER.normal) => ({
  transition: { delay: index * baseDelay },
});

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: ANIMATION.duration.slow, ease: ANIMATION.ease.standard },
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: ANIMATION.ease.spring,
};
```

### 1.4 Crear `packages/ui/src/utils/animations/use-reduced-motion.ts`

```typescript
import { useReducedMotion as useMotionReducedMotion } from 'motion';
import { useMemo } from 'react';
import { ANIMATION } from './constants';

export function useReducedMotion() {
  const shouldReduceMotion = useMotionReducedMotion();

  return useMemo(() => ({
    shouldReduceMotion,
    duration: shouldReduceMotion ? ANIMATION.duration.fast : ANIMATION.duration.normal,
    stagger: shouldReduceMotion ? 0 : undefined,
  }), [shouldReduceMotion]);
}

export function getAnimationDuration(duration: keyof typeof ANIMATION.duration, shouldReduce?: boolean) {
  return shouldReduce ? ANIMATION.duration.fast : ANIMATION.duration[duration];
}
```

### 1.5 Crear `packages/ui/src/utils/animations/gsap-presets.ts`

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION } from './constants';

gsap.registerPlugin(ScrollTrigger);

export const gsapPresets = {
  fadeInUp: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: ANIMATION.duration.slow, ease: 'power3.out', ...options }
    );
  },

  staggerReveal: (elements: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(elements,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: ANIMATION.duration.normal, stagger: 0.1, ease: 'power3.out', ...options }
    );
  },

  scaleIn: (element: gsap.TweenTarget, options?: gsap.TweenVars) => {
    return gsap.fromTo(element,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: ANIMATION.duration.slow, ease: 'back.out(1.7)', ...options }
    );
  },

  parallax: (element: gsap.TweenTarget, speed = 0.5) => {
    return gsap.to(element, {
      y: () => window.innerHeight * speed * 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  },
};

export { gsap, ScrollTrigger };
```

### 1.6 Crear `packages/ui/src/utils/gsap.ts`

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

export { gsap, ScrollTrigger, Flip };
```

### 1.7 Extraer `packages/ui/src/styles/animations.module.css`

```css
@keyframes bell-ring {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(15deg); }
  20%  { transform: rotate(-12deg); }
  30%  { transform: rotate(10deg); }
  40%  { transform: rotate(-8deg); }
  50%  { transform: rotate(6deg); }
  60%  { transform: rotate(-4deg); }
  70%  { transform: rotate(3deg); }
  80%  { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

.bell-ring {
  animation: bell-ring 0.9s ease-in-out;
  transform-origin: top center;
}

@keyframes badge-pop {
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.badge-pop {
  animation: badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

---

## Fase 2 - Landing + 404 (Alta Prioridad)

### 2.1 LandingHero.tsx → Motion One

**Cambios:**
- Usar `variants.ts` para animaciones de entrada
- Consolidar delays con `STAGGER`
- Usar `useReducedMotion` para accesibilidad

### 2.2 not-found.tsx → GSAP ScrollTrigger

**Cambios:**
- Migrar backgrounds animados a GSAP con ScrollTrigger
- Eliminar `motion.div` para fondos con blur
- Usar `gsapPresets.parallax` para efectos de profundidad

---

## Fase 3 - Auth + Onboarding (Prioridad Media)

### 3.1 AuthForm.tsx

**Cambios:**
- Usar `fadeInScale` para transiciones de modo
- Consolidar `transition` durations
- Eliminar `framer-motion` imports

### 3.2 Onboarding Steps

**Archivos:**
- `Onboarding.tsx` → Usar `AnimatePresence` de motion
- `welcome-step.tsx` → `fadeInUp`
- `profile-step.tsx` → `slideInRight` / `slideInLeft`
- `company-step.tsx` → `slideInRight` / `slideInLeft`
- `billing-step.tsx` → `slideInRight` / `slideInLeft`
- `success-step.tsx` → `fadeInScale`

---

## Fase 4 - Components (Prioridad Baja)

### 4.1 SettingsModal.tsx

- Usar `modalTransition` de variants
- Consolidar backdrop animation

### 4.2 NotificationDropdown.tsx

- Migrar `bell-ring` y `badge-pop` a CSS modules
- Usar `fadeInScale` para panel
- Eliminar inline `<style>` tag

### 4.3 Button.tsx

- Consolidar `whileTap`, `whileHover` usando constants

---

## Fase 5 - Cleanup

### 5.1 Verificar no queden imports de framer-motion

```bash
grep -r "framer-motion" packages/ui/src
```

### 5.2 Actualizar package.json

```json
{
  "dependencies": {
    "motion": "^12.x",
    "gsap": "^3.x"
  }
}
```

### 5.3 Agregar exports en index.ts

```typescript
export * from './utils/animations/constants';
export * from './utils/animations/variants';
export * from './utils/animations/use-reduced-motion';
```

---

## Checklist de Implementación

- [x] Fase 1.1: Instalar dependencias
- [x] Fase 1.2: Crear constants.ts
- [x] Fase 1.3: Crear variants.ts
- [x] Fase 1.4: Crear use-reduced-motion.ts
- [x] Fase 1.5: Crear gsap-presets.ts
- [x] Fase 1.6: Crear gsap.ts
- [x] Fase 1.7: Extraer CSS keyframes
- [x] Fase 2.1: Migrar LandingHero
- [x] Fase 2.2: Migrar not-found.tsx
- [x] Fase 3.1: Migrar AuthForm
- [x] Fase 3.2: Migrar Onboarding steps
- [x] Fase 4.1: Migrar SettingsModal
- [x] Fase 4.2: Migrar NotificationDropdown
- [x] Fase 4.3: Migrar Button
- [x] Fase 5.1: Verificar imports
- [x] Fase 5.2: Actualizar package.json
- [x] Fase 5.3: Actualizar exports
- [x] Fase 6.1: Instalar next-view-transitions ✅
- [x] Fase 6.2: Crear ViewTransitionProvider ✅
- [x] Fase 6.3: Agregar estilos globals.css ✅
- [x] Fase 6.4: Crear use-view-transition hook ✅
- [x] Fase 6.5: Crear PageViewTransition components ✅

---

## Notas de Performance

### Propiedades GPU-Accelerated
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, grayscale)

### Evitar en Animaciones
- `width`, `height`, `top`, `left` (layout recalc)
- `box-shadow` animado
- Animaciones con `blur` en elementos grandes

### Best Practices
1. Usar `will-change: transform` solo en animaciones continuas
2. Siempre usar `useReducedMotion` para accesibilidad
3. Consolidar durations y easings con constants
4. Preferir `transform` sobre `top/left` para movimiento

---

## Fase 6 - View Transitions (Shared Element Transitions)

### Concepto
View Transitions API permite transiciones fluidas entre páginas. Los **shared element transitions** permiten que elementos específicos (cards, headers, logos) mantengan su posición/tamaño mientras el resto cambia.

### Stack
| Paquete | Descripción | Estado |
|---------|-------------|--------|
| **`next-view-transitions`** | Wrapper oficial para Next.js App Router | ✅ Instalado |
| **CSS View Transitions** | API nativa del navegador | ✅ Implementada |

### Archivos Creados

```
apps/web/
├── components/
│   ├── ViewTransitionProvider.tsx    # Provider global
│   └── view-transitions/
│       └── index.tsx                 # Componentes PageViewTransition, SharedElement
├── hooks/
│   └── use-view-transition.ts        # Hook para animaciones
└── app/
    └── globals.css                    # Estilos vt-* agregados
```

### Uso

#### 1. ViewTransitionProvider (ya configurado en layout.tsx)

```tsx
import { ViewTransitionProvider } from '@/components/ViewTransitionProvider';

// En layout.tsx
<ViewTransitionProvider>
  {children}
</ViewTransitionProvider>
```

#### 2. Shared Element Transitions

```tsx
// En la lista de productos
<div style={{ viewTransitionName: `product-card-${product.id}` }}>
  <ProductCard product={product} />
</div>

// En la página de detalle (mismo viewTransitionName)
<div style={{ viewTransitionName: `product-card-${product.id}` }}>
  <ProductHeader product={product} />
</div>
```

#### 3. Usar el hook `use-view-transition`

```tsx
import { useViewTransition, getSharedTransitionName } from '@/hooks/use-view-transition';

function ProductCard({ product }) {
  const { getViewTransitionStyle } = useViewTransition({ name: 'slide-up' });
  
  return (
    <div style={getViewTransitionStyle()}>
      {/* contenido */}
    </div>
  );
}

// Para elementos compartidos
const cardName = getSharedTransitionName('product', product.id);
// viewTransitionName={cardName}
```

#### 4. PageViewTransition para páginas

```tsx
import { PageViewTransition } from '@/components/view-transitions';

export default function DashboardPage() {
  return (
    <PageViewTransition type="slide-up">
      {/* contenido de la página */}
    </PageViewTransition>
  );
}
```

### Dónde aplicar en SimplappV2

| Ubicación | Shared Elements | Tipo de Transición |
|-----------|-----------------|-------------------|
| Dashboard Cards → Detalle | Card completa | scale + fade |
| Header Logo | Logo Simplapp | slide |
| Product Image | Imagen principal | crossfade |
| Invoice Status Badge | Badge de estado | fade |
| Settings Modal | Header del modal | slide-up |

### Ejemplo: Transición de Card a Detalle

```tsx
// apps/web/app/(dashboard)/products/page.tsx
<ProductCard 
  style={{ viewTransitionName: `product-${product.id}` }}
/>

// apps/web/app/(dashboard)/products/[id]/page.tsx
<ProductHeader 
  style={{ viewTransitionName: `product-${id}` }}
/>
```

### Estilos CSS Disponibles

| Clase | Animación |
|-------|-----------|
| `.vt-fade` | Fade in/out |
| `.vt-slide-right` | Slide desde la derecha |
| `.vt-slide-up` | Slide desde abajo |
| `::view-transition-old/new(root)` | Transición de página completa |

### Checklist View Transitions

- [x] Instalar `next-view-transitions`
- [x] Crear `ViewTransitionProvider`
- [x] Agregar estilos base en globals.css
- [x] Crear hook `use-view-transition`
- [x] Crear componentes `PageViewTransition`, `SharedElement`
- [ ] Documentar uso en Storybook
- [ ] Agregar ejemplos en Storybook stories

### Notas
- View Transitions requieren soporte del navegador (Chrome/Edge✅, Safari Preview, Firefox en desarrollo)
- Usar feature detection para fallback:
  ```css
  @supports not (view-transition-name: none) {
    /* Fallback styles */
  }
  ```
- Para elementos compartidos, el `viewTransitionName` debe coincidir exactamente en ambas páginas
