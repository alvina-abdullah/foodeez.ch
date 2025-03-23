import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Legacy MySQL connection (keeping for reference/compatibility)
import mysql from "mysql2/promise";

export const createConnection = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        port: parseInt(process.env.DATABASE_PORT || "3306"),
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
    });

    return connection;
}