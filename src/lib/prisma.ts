import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Reuse the client across hot reloads and warm Vercel serverless invocations.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    errorFormat: 'minimal',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

globalForPrisma.prisma = prisma
