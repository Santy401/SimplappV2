import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/simplapp',
  },
})
