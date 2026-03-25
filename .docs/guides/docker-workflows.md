# 🐳 Guía de Workflows de Docker (Simplapp V2)

Este documento centraliza los comandos y la filosofía arquitectónica sobre cómo ejecutamos nuestro entorno de contenedores en Simplapp V2, separando **Desarrollo (Dev)** y **Producción (Prod)**.

---

## 🏗️ Filosofía de Contenedores

En aplicaciones construidas con *Next.js + Turborepo + Prisma*, suele existir una diferencia notable entre compilar el código para publicar (Producción) y correrlo para programar iterativamente (Desarrollo).

1. **Producción (`Dockerfile` / `docker-compose.yml`)**: Diseñado para crear un entorno hermético y veloz. Copia los archivos estáticos pre-compilados y los ejecuta sin admitir cambios en tiempo real.
2. **Desarrollo (`Dockerfile.dev` / `docker-compose.dev.yml`)**: Diseñado para el Programador. Utiliza "Volúmenes" (`volumes`) para montar el código fuente de tu máquina Windows hacia el entorno Linux de Docker en vivo. Esto permite **Hot Module Replacement (HMR)**: Editas un `.tsx` en VS Code, y se actualiza al instante en `http://localhost:3000`.

---

## 🛠️ Comandos de Desarrollo (Live-Reload)

**Uso Principal**: Cuando necesitas programar frontend/backend y quieres ver los cambios reflejados al instante usando estrictamente Docker en lugar de Node local.

### 1. Levantar Entorno Dev
Se utiliza el archivo especial `.dev.yml` pasándole la bandera `-f` (file).

```powershell
# Levanta el contenedor en segundo plano (Descargará dependencias / node_modules si es la primera vez)
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Ver Registros y Logs en Vivo
Si quieres ver los `console.log` de la app, el progreso del `pnpm install`, o los errores en tiempo real de Next.js:

```powershell
docker logs -f simplapp-web-dev
```
*(Para salir del visor, presiona `Ctrl + C`)*.

### 3. Apagar el Entorno Dev
```powershell
docker-compose -f docker-compose.dev.yml down
```

---

## 🚀 Comandos de Producción

**Uso Principal**: Cuando terminas un feature y quieres verificar que la versión compilada final (estática) se ejecuta perfectamente antes de publicar a un servidor real.

### 1. Construir e Iniciar Producción
```powershell
docker-compose up -d --build
```

### 2. Apagar Producción
```powershell
docker-compose down
```

---

## 🚨 Notas Importantes

### El Primer Arranque (Dev)
La primera vez que levantas el contenedor `simplapp-web-dev`, este debe ejecutar un `pnpm install` para compilar los ejecutables nativos de Linux de `Prisma`, `esbuild` y Next.js. Esto tardará varios minutos.
**NO** es recomendable mapear tus `/node_modules` locales hacia el contenedor (exclusiones de volumen) ya que Windows y Linux Alpine usan binarios irreconciliables.

### Alternativa: 100% Nativo (`pnpm dev`)
Si tu entorno Docker es lento sincronizando Windows -> Linux, nuestra arquitectura (según `GEMINI.md`) recomienda:
1. Iniciar solo la base de datos de Docker: `docker-compose up -d db`
2. Correr la app localmente: `pnpm dev`
