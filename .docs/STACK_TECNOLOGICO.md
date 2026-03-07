# Stack Tecnológico — Simplapp V2 🚀

Este documento detalla todas las tecnologías, librerías y herramientas que dan vida a Simplapp V2. Está organizado por categorías para facilitar su comprensión.

---

## 🏗️ Core & Arquitectura
- **[Next.js 16 (App Router)](https://nextjs.org/)**: El framework principal de React. Usamos el App Router para el manejo de rutas y Server Actions.
- **[TypeScript 5](https://www.typescriptlang.org/)**: Lenguaje principal que añade tipado estático para evitar errores antes de ejecutar el código.
- **[PNPM Workspaces](https://pnpm.io/)**: Gestor de paquetes que permite manejar múltiples proyectos (monorepo) de forma eficiente.
- **[Turborepo](https://turbo.build/)**: Herramienta que acelera los builds y tareas repetitivas en el monorepo.

---

## 🎨 UI & Estilizado
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos basado en utilidades. Es extremadamente rápido y mantiene el diseño consistente.
- **[Radix UI](https://www.radix-ui.com/)**: Librería de componentes "sin estilo" que garantiza accesibilidad y funcionalidad profesional (modales, selects, checkboxes).
- **[Framer Motion](https://www.framer.com/motion/)**: Motor de animaciones premium para transiciones suaves y efectos interactivos.
- **[Lucide React](https://lucide.dev/)**: Set de iconos modernos y consistentes.
- **[Sonner](https://sonner.emilkowal.ski/)**: Sistema de notificaciones (toasts) elegantes y minimalistas.

---

## 🗄️ Base de Datos & Backend
- **[PostgreSQL](https://www.postgresql.org/)**: Base de datos relacional robusta y escalable.
- **[Prisma ORM](https://www.prisma.io/)**: Herramienta que nos permite hablar con la base de datos usando código TypeScript, con autocompletado y validación de tipos.
- **[Resend](https://resend.com/)**: Servicio profesional para el envío de correos electrónicos transaccionales (bienvenida, recuperación de contraseña).

---

## 🧠 Manejo de Estado & Datos
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Gestiona la carga, caché y sincronización de datos de la API. Evita peticiones innecesarias al servidor.
- **[Context API](https://react.dev/learn/passing-data-deeply-with-context)**: Usado para estados globales sencillos como la navegación (`NavigationContext`) y selecciones actuales (`AppStateContext`).
- **[React Hook Form](https://react-hook-form.com/)**: Gestión eficiente de formularios, validaciones y estados de error.
- **[Zod](https://zod.dev/)**: Esquemas de validación de datos tanto en el cliente como en el servidor. Garantiza que la información tenga el formato correcto.

---

## 🔐 Seguridad & Auth
- **[Jose](https://github.com/panva/jose) & [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**: Librerías para manejar tokens JWT de forma segura.
- **[Bcryptjs](https://github.com/dcodeIO/bcrypt.js/)**: Algoritmo para encriptar contraseñas. Nunca guardamos contraseñas en texto plano.
- **Cookies httpOnly**: Método de almacenamiento de tokens que impide que scripts maliciosos (XSS) los roben.

---

## 🛠️ Utilidades Extra
- **[PapaParse](https://www.papaparse.com/)**: Potente librería para convertir datos JSON a archivos CSV y viceversa (usado en exportaciones).
- **[Date-fns](https://date-fns.org/)**: Manipulación y formateo de fechas de forma sencilla.
- **[Recharts](https://recharts.org/)**: Librería de gráficos interactivos para el dashboard de métricas.
- **[LRU Cache](https://github.com/isaacs/node-lru-cache)**: Caché en memoria usada principalmente para el Rate Limiting (evitar ataques de fuerza bruta).

---

## 🚀 Despliegue & DevOps
- **[Vercel](https://vercel.com/)**: Plataforma donde vive el código y se autodespliega con cada cambio en Git.
- **[ESLint](https://eslint.org/)**: Herramienta que revisa la calidad del código y nos avisa si estamos cometiendo errores de sintaxis o malas prácticas.
