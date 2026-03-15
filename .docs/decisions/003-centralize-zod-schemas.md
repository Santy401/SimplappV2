# Decisión: Centralización de Esquemas de Validación (Zod)

**Fecha:** 15 de marzo de 2026
**Estado:** Aceptado

## Contexto
Anteriormente, los esquemas de validación de Zod para las APIs se encontraban directamente en `apps/web/lib/api-schemas.ts`. Esta ubicación limitaba la reutilización de las reglas de negocio en otros paquetes del monorepo (como una futura API externa o una aplicación móvil) y forzaba a la aplicación web a ser la única "dueña" de las reglas de validación.

## Decisión
Hemos decidido mover todos los esquemas de validación de Zod al paquete core `@simplapp/domain`.

Los cambios realizados incluyen:
1. Creación del directorio `packages/domain/src/schemas/`.
2. Separación de esquemas por dominio funcional (`auth.schema.ts`, `onboarding.schema.ts`).
3. Exportación de estos esquemas (y sus tipos inferidos) a través del punto de entrada principal del paquete de dominio.
4. Refactorización de `apps/web/lib/api-schemas.ts` para que actúe como un adaptador, re-exportando los esquemas desde el dominio y manteniendo el helper `parseBody` (que depende de Next.js).

## Consecuencias Positivas
- **Única Fuente de Verdad (SSOT):** Las reglas de validación (longitud de contraseñas, formatos de email, etc.) están definidas en un solo lugar para todo el ecosistema Simplapp.
- **Tipado Fuerte Compartido:** Ahora podemos importar tipos como `LoginApiInput` en cualquier parte del monorepo sin crear dependencias circulares con la aplicación web.
- **Facilidad para Multi-plataforma:** Si mañana creamos `apps/mobile`, podrá usar exactamente las mismas validaciones que usa la web, garantizando consistencia total en los datos.

## Consecuencias Negativas
- Añade una pequeña capa de indirección al tener que importar desde el workspace package en lugar de un archivo local.
- Requiere ejecutar el build del paquete de dominio para que los cambios se reflejen en los consumidores (gestionado eficientemente por Turborepo).
