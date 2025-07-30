// // import { PrismaClient } from "@prisma/client"

import { PrismaClient } from "@/app/generated/prisma"



// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     // log: ["query", "error", "warn"],
//   })

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// export default prisma

// import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma
}

export default prisma

// Helper function to handle Prisma errors
export function handlePrismaError(error: any): never {
  console.error('Prisma error:', error)
  
  if (error.code === 'P2002') {
    throw new Error('A record with this data already exists')
  }
  
  if (error.code === 'P2025') {
    throw new Error('Record not found')
  }
  
  if (error.code === 'P2003') {
    throw new Error('Foreign key constraint failed')
  }
  
  if (error.code === 'P2014') {
    throw new Error('Invalid ID provided')
  }
  
  throw new Error(error.message || 'Database operation failed')
}

// Helper function for safe transactions
export async function executeTransaction<T>(
  fn: (tx: Parameters<PrismaClient['$transaction']>[0] extends (arg: infer U) => any ? U : never) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => fn(tx), {
      maxWait: 5000, // Maximum time to wait for a transaction slot (5 seconds)
      timeout: 10000, // Maximum time the transaction can run (10 seconds)
      isolationLevel: 'ReadCommitted'
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

// Helper function to safely disconnect
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}