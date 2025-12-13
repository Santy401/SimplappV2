// /home/developer/Work/Simplapp/prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: './prisma/schema.prisma', // Ruta a tu esquema
  migrations: {
    path: './prisma/migrations', // Ruta a tus migraciones
  },
  datasource: {
    url: env("DATABASE_URL"),           // URL para migraciones
  },
});