# ADR 001: Corrección de la Ubicación del Prisma Schema en Empaquetado

## Contexto
Durante el proceso de empaquetamiento y construcción de la imagen de producción usando Docker (`pnpm install --frozen-lockfile` en el paso `installer`), Prisma automáticamente invoca el script `postinstall` nativo de `@prisma/client`. Este script intenta generar el cliente a partir de un archivo `schema.prisma`. 

Por defecto, Prisma siempre busca el archivo en la ruta estándar `/prisma/schema.prisma` dentro de un paquete. Sin embargo, en Simplapp V2 usamos una generación y esquema customizado localizado en `apps/web/prisma/src/generated/prisma/schema.prisma`, lo que resultaba en que el build fallara con el siguiente error letal:
`Could not find Prisma Schema that is required for this command.`

## Decisión
Se decidió añadir estrictamente el campo pre-configurado de prisma dentro del `apps/web/package.json`:

```json
"prisma": {
  "schema": "prisma/src/generated/prisma/schema.prisma"
}
```

Esto sobreescribe el comportamiento por defecto de la CLI de Prisma, indicándole la ruta exacta durante cualquier paso de CI/CD, Instalación o Construcción de Docker. Además, habilitará de manera correcta las intellisenses en compiladores aislados.

## Alternativas Consideradas
- **Mover el Schema**: Mover el `schema.prisma` a la carpeta raíz (`apps/web/prisma`). Descartado porque rompe el flujo de autogeneración customizado del proyecto.
- **Usar un flag `--schema` manual**: Añadir el flag explicitamente en los scripts de Next.js (`prisma generate --schema=xyz`). Descartado porque no soluciona la ejecución automática oculta del hook `postinstall`.

## Consecuencias Positivas
- Resuelve permanentemente los errores en local y en entornos confinados de Linux / Docker.
- Prisma Generate es ahora robusto e independiente del directorio de ejecución.
- La experiencia al realizar builds locales y de producción (CI) es mucho más estable.
