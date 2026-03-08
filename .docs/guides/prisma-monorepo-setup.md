# Guía de Referencia: Gestión de Prisma Client en un Monorepo

En un monorepo (como Simplapp V2 estructurado con `pnpm workspaces`), la generación y resolución del cliente de Prisma puede volverse compleja. Es muy común encontrarse con errores del tipo `Module '"@prisma/client"' has no exported member 'PrismaClient'` cuando la configuración no es simétrica entre los paquetes.

Este documento explica las causas comunes de este problema y define las buenas prácticas para evitar que vuelva a suceder.

---

## 1. El Problema: Custom Output y Rutas Desincronizadas

Por defecto, Prisma genera el cliente en `node_modules/@prisma/client`. Sin embargo, en Simplapp V2, el cliente cuenta con un **Custom Output** definido en el archivo `apps/web/prisma/schema.prisma`:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "library"
  output     = "./src/generated/prisma" // <--- CUSTOM OUTPUT
}
```

El problema surge cuando otras dependencias internas del monorepo (como `packages/interfaces` o `packages/domain`) intentan importar el cliente de Prisma. Si los archivos `tsconfig.json` de cada subpaquete siguen apuntando al `node_modules` tradicional, Typescript **no podrá encontrar la definición**.

---

## 2. Solución: Sincronización Estricta de `paths` en los `tsconfig.json`

Para evitar estos errores de build, es crítico que **cualquier paquete del monorepo que dependa de Prisma Client** apunte explícitamente a la ruta en la que se está generando mediante la configuración de `paths` en su respectivo `tsconfig.json`.

Si la ruta original es `./src/generated/prisma` en `apps/web/prisma`, todos los paquetes dependientes deben apuntar allí.

### 🌟 Ejemplo: Configuración correcta

**(A) En `apps/web/tsconfig.json`:**
Se mapea de manera relativa a su propia ubicación.

```json
{
  "compilerOptions": {
    "paths": {
      "@prisma/client": ["./prisma/src/generated/prisma"]
    }
  }
}
```

**(B) En `packages/interfaces/tsconfig.json`:**
El path debe retroceder en la estructura de carpetas (monorepo) para apuntar exactamente a la misma carpeta:

```json
{
  "compilerOptions": {
    "paths": {
      "@prisma/client": ["../../apps/web/prisma/src/generated/prisma"]
    }
  }
}
```

> **❗ Regla de Oro:** Si alguna vez cambias la ubicación de la propiedad `output` dentro de `schema.prisma`, **debes actualizar obligatoriamente** todos los hipervínculos de los respectivos `tsconfig.json` de cada carpeta en tu workspace (`apps/web`, `packages/interfaces`, `packages/domain` si aplica).

---

## 3. Scripts de Pre-Build y Sincronización Automática

Para garantizar que el Prisma Client generado esté disponible para el momento del empaquetado y que la última versión del schema sea de la que se toman las dependencias, siempre define un script pre-build.

En los `package.json` dependientes debe configurarse así:

```json
{
  "scripts": {
    "prebuild": "prisma generate --schema=../../apps/web/prisma/schema.prisma",
    "build": "tsc"
  }
}
```

Esto asegura que cuando se construya el paquete desde cero (ej. en un despliegue de Vercel/CI), se recojan de inmediato todas las tipificaciones correctas según el schema de Prisma central, generándolas en el output correcto antes de que el comando `tsc` evalúe el código.

---

## 4. Checklist para Nuevos Paquetes en el Monorepo que necesiten Prisma

Si creas un nuevo sub-paquete (workspace) y este usa datos de Prisma, asegúrate de:

- [ ] Añadir la dependencia `@prisma/client` en `peerDependencies` o `dependencies` de su `package.json`.
- [ ] En su `tsconfig.json`, añadir el path-alias para apuntar al Custom Output de `apps/web/prisma/src/generated/prisma`.
- [ ] Asegurarse de tener un comando `prebuild` en su `package.json` para ejecutar `prisma generate` sobre el schema original antes del `build`.
