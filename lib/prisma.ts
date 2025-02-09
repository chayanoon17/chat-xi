import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

// Export prisma client directly
export default prisma;
