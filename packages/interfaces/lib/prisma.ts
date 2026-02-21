
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  const client = new PrismaClient({
    adapter,
    log: ['query'],
  })

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const softDeleteModels = ['Bill', 'Client', 'Product', 'Company']
          
          if (softDeleteModels.includes(model)) {
            const clientModel = model.charAt(0).toLowerCase() + model.slice(1);

            if (['findFirst', 'findMany', 'findUnique', 'findFirstOrThrow', 'findUniqueOrThrow', 'count', 'aggregate', 'groupBy'].includes(operation)) {
              if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
                // Si ya se especificó un filtro sobre deletedAt, no lo sobreescribimos
                if (args.where && 'deletedAt' in args.where) {
                  return query(args);
                }
                const newOp = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
                return (client as any)[clientModel][newOp]({
                  ...args,
                  where: { ...args.where, deletedAt: null }
                });
              }
              
              if (args.where && !('deletedAt' in args.where)) {
                args.where = { ...args.where, deletedAt: null }
              }
            }
            
            if (['update', 'updateMany', 'upsert'].includes(operation)) {
              if (args.where && !('deletedAt' in args.where)) {
                args.where = { ...args.where, deletedAt: null }
              }
            }

            if (operation === 'delete') {
              return (client as any)[clientModel].update({
                where: args.where,
                data: { deletedAt: new Date() },
              })
            }
            
            if (operation === 'deleteMany') {
              return (client as any)[clientModel].updateMany({
                where: args.where,
                data: { deletedAt: new Date() },
              })
            }
          }
          
          return query(args)
        },
      },
    },
  })
}

type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>

declare const globalThis: {
  prismaGlobal: ExtendedPrismaClient;
} & typeof global;

export const prisma = (globalThis as any).prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') (globalThis as any).prismaGlobal = prisma