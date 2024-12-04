import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react'; // ใช้ getSession จาก next-auth

const prisma = new PrismaClient();

async function createChatRoom() {
  const session = await getSession(); // ดึงข้อมูล session

  if (!session) {
    console.log("User is not logged in.");
    return; // หากไม่มี session ก็ไม่ทำการสร้าง Chat Room
  }

  const userId = session.user.id;

  const newChatRoom = await prisma.chatRoom.create({
    data: {
      title: 'New Chat Room',
      userId: userId, // ใช้ userId ที่ได้จาก session
    },
  });
  console.log('Created chat room:', newChatRoom);
}

createChatRoom().catch((e) => {
  throw e;
}).finally(async () => {
  await prisma.$disconnect();
});

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
