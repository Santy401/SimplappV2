# ADR 001: División del Esquema de Prisma en Múltiples Archivos

## Estado
Aceptado

## Contexto
El esquema original de Prisma (`schema.prisma`) creció significativamente a medida que se añadieron más modelos, enumeradores y relaciones para soportar las diversas funcionalidades de **Simplapp V2** (facturación electrónica, inventario, CRM, usuarios, etc.). Esto provocó varios problemas:

1. **Mantenibilidad y Legibilidad**: Un único archivo muy extenso se vuelve difícil de navegar, editar y entender, especialmente para nuevos desarrolladores.
2. **Conflictos en Git**: Múltiples desarrolladores trabajando en diferentes dominios del sistema a menudo causaban conflictos de fusión (*merge conflicts*) al intentar modificar el mismo archivo.
3. **Límites de Dominio Difusos**: Al estar todas las entidades en el mismo lugar, no había una separación clara entre los diferentes bounded contexts (e.g., Facturación vs. Usuarios vs. Inventario), promoviendo un acoplamiento no deseado.

## Decisión
Se decidió aprovechar la característica de *Prisma Schema (Preview Feature: `prismaSchemaFolder`)* para dividir la configuración y los modelos del ORM en múltiples archivos más pequeños y manejables, organizados por dominio. 

Cada sub-dominio o módulo ahora tiene su propia definición en la carpeta `prisma/schema/` (por ejemplo, `user.prisma`, `company.prisma`, `billing.prisma`, etc.).

## Consecuencias Positivas
- **Mejor Organización**: Facilita la comprensión de la estructura de datos al separar las responsabilidades de acuerdo con la lógica de dominio puro (Domain-driven Design, en línea con el paquete `@simplapp/domain`).
- **Desarrollo Paralelo**: Minimiza las posibilidades de conflictos en el sistema de versionado al permitir que diferentes equipos o desarrolladores editen distintos archivos simultáneamente de forma transparente.
- **Escalabilidad del Código**: Preparado para continuar creciendo sin comprometer la ergonomía de desarrollo.

## Consecuencias Negativas / Retos
- **Configuración Adicional**: Requiere mantener activada la *preview feature* de configuración `prismaSchemaFolder` en el entorno de desarrollo y en los pipelines de CI/CD.
- **Cambios en los Comandos Habituales**: Algunos comandos o herramientas que por defecto busquen el archivo único `schema.prisma` en la raíz (como ciertos generadores o *scripts* personalizados) requieren configuraciones adicionales o pueden fallar si no apuntan a la carpeta (esto requiere ajustes en `package.json` o en la configuración base de Prisma).

## Notas Adicionales
Para trabajar con esta estructura dividida, es importante asegurarse de que el comando `prisma generate` y `prisma db push` procesen toda la carpeta y que la característica de preview siempre se mantenga en el bloque del generador:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}
```
