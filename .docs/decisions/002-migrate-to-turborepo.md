# Decisión: Migración a Turborepo

**Fecha:** 15 de marzo de 2026
**Estado:** Aceptado

## Contexto
El proyecto Simplapp V2 es un monorepo gestionado con `pnpm workspaces`. A medida que el proyecto ha crecido en complejidad (múltiples paquetes como `@simplapp/domain`, `@simplapp/interfaces`, `@simplapp/ui` y aplicaciones como `apps/web`), los tiempos de construcción (`build`), el linting y la ejecución de entornos de desarrollo se han incrementado. 

Hasta ahora, utilizábamos los comandos recursivos de pnpm (`pnpm -r build`), lo cual es funcional pero ineficiente, ya que pnpm ejecuta las tareas de forma secuencial o paralela sin memoria caché entre ejecuciones previas. Esto provocaba que, incluso si el código de un paquete no cambiaba, se recompilara de nuevo en cada ciclo de integración y despliegue continuo (CI/CD).

## Decisión
Hemos decidido adoptar **Turborepo** como orquestador de tareas para nuestro monorepo.

La configuración se ha introducido a través de:
1. La adición de la dependencia de desarrollo `turbo` en la raíz.
2. La definición de un `turbo.json` en la raíz que establece el *pipeline* del proyecto:
   - `build`: Depende de las tareas `build` de las dependencias (`^build`) y se almacena en caché basándose en los directorios de salida (`dist`, `.next`).
   - `lint`: Ejecuta el linting, cacheados por defecto.
   - `dev`: Se declara como proceso persistente sin caché para levantar entornos locales (`cache: false, persistent: true`).
3. La modificación de los scripts del `package.json` raíz (`dev`, `build`, `lint`) para utilizar el CLI `turbo run`.

## Consecuencias Positivas (Beneficios)
- **Tiempos de Build Reducidos:** Gracias a la caché remota y local, `turbo` solo reconstruye o evalúa los paquetes que han sufrido cambios en su código fuente, evitando recompilar módulos que ya se habían analizado en ejecuciones pasadas.
- **Orquestación de Dependencias:** Turborepo entiende el grafo de dependencias de `pnpm workspaces` de forma nativa. Ejecutará automáticamente las tareas de las dependencias antes que las del consumidor (ej. construye `@simplapp/domain` antes de iniciar la construcción de `apps/web`).
- **Mejor DX (Developer Experience):** Mayor rapidez durante el flujo de trabajo diario y facilidad para escalar el proyecto o incorporar nuevas aplicaciones (`apps/mobile`, `apps/api`) sin impactar exponencialmente los tiempos de espera del equipo.

## Consecuencias Negativas
- Añade una capa de complejidad al pipeline con la introducción de los archivos `turbo.json`. Es necesario que los desarrolladores entiendan cómo funcionan las dependencias topológicas (`^`) y las definiciones de `outputs` en el manifiesto.