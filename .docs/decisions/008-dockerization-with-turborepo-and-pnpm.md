# ADR 008: Dockerización con Turborepo y pnpm

## Contexto
Simplapp V2 es un monorepo complejo gestionado con `pnpm` y `turbo`. Para su despliegue en producción y estandarización de entornos de desarrollo, se requiere una solución de contenedores (Docker) que sea eficiente, segura y compatible con el flujo de CI/CD.

## Decisiones Técnicas

### 1. Estrategia de "Pruning" (Podado)
Utilizamos `turbo prune --scope=simplapp --docker` en una etapa de construcción intermedia.
- **Razón**: Permite extraer solo el código y las dependencias necesarias para la aplicación específica (`apps/web`), evitando copiar todo el monorepo y reduciendo drásticamente el tamaño del contexto de construcción.

### 2. Output Standalone de Next.js
Habilitamos `output: 'standalone'` en `next.config.ts`.
- **Razón**: Next.js genera un servidor minimalista que incluye solo las dependencias de `node_modules` realmente utilizadas. Esto permite que la imagen final sea extremadamente pequeña (~150MB en lugar de >1GB).

### 3. Imágenes Base
- **Node 20-Alpine**: Para el runtime de Node.js, por su seguridad y ligereza.
- **PostgreSQL 16-Alpine**: Para la base de datos local en desarrollo.

### 4. Orquestación con Docker Compose
Se incluyó un `docker-compose.yml` que levanta la base de datos y la aplicación web, configurando automáticamente las variables de entorno necesarias para su comunicación interna.

### 5. Validación en CI
Se añadió un job `docker-build` en GitHub Actions para validar que el `Dockerfile` siga siendo funcional tras cualquier cambio en el código.

## Consecuencias
- **Positivas**:
    - Entornos de desarrollo consistentes ("funciona en mi máquina").
    - Despliegues más rápidos gracias al cache de capas de Docker.
    - Imágenes de producción seguras y de bajo peso.
- **Negativas**:
    - Mayor complejidad inicial en la configuración del CI.
    - Requiere que los desarrolladores tengan Docker instalado para pruebas locales completas.

## Estado
Aprobado e Implementado.
