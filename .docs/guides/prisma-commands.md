# 📚 Guía Completa de Comandos de Prisma

Esta guía documenta los flujos de trabajo más comunes utilizando el CLI de Prisma, abarcando desde la generación del cliente hasta el reseteo completo de la base de datos para entornos de desarrollo.

---

## 🚀 1. Flujo Básico de Desarrollo

### Generar el Cliente de Prisma
```bash
npx prisma generate
```
**¿Qué hace?** Lee tu archivo `schema.prisma` y actualiza el código autogenerado del cliente de Prisma. Debes correrlo **cada vez que hagas un cambio** en el esquema para que TypeScript reconozca los nuevos modelos y campos.

### Aplicar Cambios Rápidos sin Migraciones (Prototipado)
```bash
npx prisma db push
```
**¿Qué hace?** Sincroniza el estado de tu esquema de Prisma directamente con la base de datos **sin** generar archivos de migración (SQL). Es ideal para iterar rápidamente en desarrollo local. Si la base de datos detecta que vas a perder datos (por ejemplo, al borrar columnas), pedirá confirmación extra o te sugerirá resetear.

---

## 🗄️ 2. Sistema de Migraciones (Recomendado para Producción)

Si estás trabajando en un entorno estable y necesitas llevar un registro histórico de cambios:

### Crear y Aplicar una Migración
```bash
npx prisma migrate dev --name <nombre_descriptivo>
```
**Ejemplo:** `npx prisma migrate dev --name init` o `npx prisma migrate dev --name add_user_profile`
**¿Qué hace?**
1. Compara el `schema.prisma` actual con el último estado migrado.
2. Genera un nuevo archivo SQL en la carpeta `prisma/migrations`.
3. Lo aplica a la base de datos local.
4. (Automáticamente ejecuta `prisma generate`).

### Aplicar Migraciones Existentes (En Producción)
```bash
npx prisma migrate deploy
```
**¿Qué hace?** Aplica cualquier migración en `prisma/migrations` que aún no se haya ejecutado en tu base de datos de producción o en el entorno donde se corra (lee desde tu `DATABASE_URL` y se salta `DIRECT_URL` si aplica, aunque a menudo usa directo según tu config).

---

## 🧹 3. Limpieza y Reseteo (Empezar de Cero)

A veces necesitas purgar tu base de datos porque el esquema se ensució demasiado o hubo errores con las migraciones. **¡Cuidado, estos comandos borran datos!**

### Resetear la Base de Datos Local
```bash
npx prisma migrate reset
```
**¿Qué hace?**
1. Elimina (hace drop) de forma completa la base de datos actual y la recrea.
2. Aplica todas las migraciones en la carpeta `prisma/migrations`.
3. **Ejecuta el archivo de *Seed*** (semilla) si lo tienes configurado, para insertar datos de prueba iniciales.

### Forzar el Reseteo Rápido (con db push)
Si no usas la carpeta de migraciones (`migrate dev`) sino que estás iterando con `db push` y quieres empezar de cero sin que borre la DB entera sino truncándola:
```bash
npx prisma db push --force-reset
```
**¿Qué hace?** Descarta por completo el estado actual de tu base de datos y fuerza la alineación con tu esquema actual perdiendo todos los datos.

---

## 🔍 4. Herramientas de Visualización e Inspección

### Prisma Studio
```bash
npx prisma studio
```
**¿Qué hace?** Levanta un servidor local (`http://localhost:5555` normalmente) con una interfaz gráfica (GUI) en el navegador donde puedes ver, añadir, editar o borrar registros de tus tablas comodamente.

### Inspeccionar o Descargar Estado desde DB a Schema
```bash
npx prisma db pull
```
**¿Qué hace?** Si tienes una base de datos preexistente y quieres que Prisma escriba los modelos basado en esa base de datos (Introspección), este comando leerá la BD y reescribirá tu `schema.prisma`.

---

## 🛠️ Resumen de Resolución de Conflictos (Troubleshooting)

**Problema:** "El cliente no detecta la nueva tabla o campo."
**Solución:** Múltiples entornos fallan aquí. Corre:
```bash
npx prisma generate
```

**Problema:** "La migración dice que los esquemas están desincronizados."
**Solución:** Probablemente mezclaste `db push` con `migrate dev`. Limpia todo con:
```bash
npx prisma migrate reset
```

---

> [!NOTE]
> **Modo Monorepo (`pnpm`)**: Recuerda que en arquitecturas de monorepositorios, podrías necesitar usar `pnpm dlx prisma [comando]` o situarte en el directorio correcto donde reside el paquete de prisma si Prisma no se detecta globalmente, según tu configuración en `apps/web` o `@simplapp/domain`.
