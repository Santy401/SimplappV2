# Decisión: Implementación del Sistema de Carga Global (Loading System)

**Fecha:** 15 de marzo de 2026
**Estado:** Aceptado

## Contexto
Anteriormente, los estados de carga se gestionaban de forma aislada en cada componente. Esto provocaba una experiencia de usuario fragmentada, con múltiples spinners apareciendo y desapareciendo, y sin un feedback visual unificado cuando se realizaban operaciones en segundo plano.

## Decisión
Hemos implementado un **Sistema de Carga Global** basado en Context API y un indicador unificado.

Componentes clave:
1. **`LoadingContext`**: Actúa como el cerebro, manteniendo una lista de identificadores (`activeLoaders`) de todos los procesos de carga activos en la aplicación.
2. **`GlobalLoadingIndicator`**: Un componente UI persistente en el layout del dashboard que muestra un spinner minimalista y el estado actual de la carga mediante animaciones de Framer Motion.
3. **Hook `useComponentLoading`**: Una utilidad que permite a cualquier componente "registrarse" en el sistema global al montarse y "desregistrarse" al terminar su proceso o desmontarse.

## Consecuencias Positivas
- **UX Coherente**: El usuario siempre tiene un punto fijo (esquina superior derecha) donde confirmar que la aplicación está trabajando.
- **Feedback Detallado**: El sistema permite mostrar qué se está cargando específicamente (ej. "Cargando datos de factura...").
- **Simplicidad**: Los desarrolladores ya no tienen que gestionar estados booleanos complejos en cada componente para mostrar un feedback global.
- **Fluidez**: Al usar Framer Motion, la aparición y desaparición de los indicadores es suave y no intrusiva.

## Consecuencias Negativas
- Sobrecarga de eventos: Cada proceso de carga emite cambios en el contexto global, lo que podría causar re-renders si no se gestiona con `useCallback` (ya implementado).
