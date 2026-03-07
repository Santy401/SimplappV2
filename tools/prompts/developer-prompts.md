# Prompts Útiles para el Desarrollo de Simplapp V2

## 1. Refactorización de Componentes React (Next.js)

**Prompt:**

> "Quiero refactorizar este componente React. Actualízalo para usar los patrones del monorepo (importando de `@ui` y `@domain`). Asegúrate de que use Server Components si no maneja estado interactivo, o agrega `'use client'` al principio si usa hooks. Divide las funciones complejas en archivos utilitarios puros y tipa todas las props extrayéndolas de `@domain/interfaces`."

## 2. Creación de un Nuevo Endpoint API

**Prompt:**

> "Necesito crear un nuevo endpoint en Next.js para administrar `[ENTIDAD]`. Crea el archivo `route.ts` manejando los métodos GET y POST. El endpoint debe validar la sesión leída del contexto base, revisar si es el tenant válido, e implementar paginación (offset/limit) y un filtro de búsqueda para el GET. Para el POST, usa Zod para la validación de los datos entrantes. Incluye manejo de errores genérico con status 500."

## 3. Planificación Arquitectónica (Para Claude)

**Prompt:**

> "Claude, vamos a diseñar una nueva característica para `[FUNCIONALIDAD]`. Antes de tocar código, quiero que leas `architecture.md` y prepares un plan de implementación detallado dividido en pasos atómicos. Considera:
>
> 1. Modificación de esquema Prisma (si aplica).
> 2. Estructura de la API.
> 3. Flujo en el cliente y sincronización con Tailwind/TanStack Query.
>    Preséntame el plan para mi validación."

## 4. Debugging Iterativo de Interfaz de Usuario

**Prompt:**

> "Tengo un problema visual en el componente `[COMPONENTE.tsx]`. El comportamiento actual es `[COMPORTAMIENTO_ERRONEO]` pero debería ser `[COMPORTAMIENTO_ESPERADO]`. Por favor revisa el archivo, encuentra qué clases de Tailwind o qué hook de estado está causando esto. Explícame de forma didáctica qué fallaba y dame la solución lista para aplicar, usando atomic commits."

## 5. Scripting y Mantenimiento de Base de Datos

**Prompt:**

> "Escribe un script en TypeScript dentro de `tools/scripts/` que corra usando el entorno de pruebas. El objetivo del script es iterar sobre todos los `[ENTIDAD]` de la empresa activa y buscar duplicados o campos nulos que rompan las reglas de negocio, e imprimirlos en consola sin modificar la DB. Usa el archivo `prisma.ts` del paquete `@interfaces/lib` para la conexión."
