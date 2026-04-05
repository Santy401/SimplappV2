import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as typeof globalThis & {
  __prisma?: PrismaClient
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    const { Pool } = require('pg') as { Pool: new (config: { connectionString: string }) => any }
    const pool = new Pool({ connectionString: 'postgresql://placeholder:placeholder@localhost:5432/placeholder' })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }
  const { Pool } = require('pg') as { Pool: new (config: { connectionString: string }) => any }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })
}

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = createPrismaClient()
}

export const prisma = globalForPrisma.__prisma!
