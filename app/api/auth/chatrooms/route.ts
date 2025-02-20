// api/auth/chatrooms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Prisma Client
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions'; 
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้อง
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    // แปลง userId เป็น ObjectId
    const userObjectId = new ObjectId(userId);

    // สร้าง Chat Room
    const newChatRoom = await prisma.chatRoom.create({
      data: {
        title,
        createdAt: new Date(),
        userId: userObjectId.toHexString(), // ใช้ ObjectId ที่แปลงเป็น string
      },
    });

    return NextResponse.json(newChatRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้อง
    if (!userId) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }
    

    // แปลง userId เป็น ObjectId
    const userObjectId = new ObjectId(userId);

    const chatRooms = await prisma.chatRoom.findMany({
      where: { userId: userObjectId.toHexString() }, // ใช้ ObjectId เป็น string
      select: { id: true, title: true, createdAt: true } // ดึงเฉพาะที่จำเป็น

    });

    return NextResponse.json(chatRooms, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await req.json();

    if (!roomId) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const userId = session.user.id;

    // ตรวจสอบว่า userId และ roomId เป็น ObjectId ที่ถูกต้อง
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: 'Invalid User or Room ID' }, { status: 400 });
    }

    // แปลง userId และ roomId เป็น ObjectId
    const userObjectId = new ObjectId(userId);
    const roomObjectId = new ObjectId(roomId);

    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomObjectId.toHexString() }, // ใช้ ObjectId เป็น string
    });

    if (!chatRoom || chatRoom.userId !== userObjectId.toHexString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.message.deleteMany({
      where: { chatRoomId: roomObjectId.toHexString() }, // ใช้ ObjectId เป็น string
    });

    await prisma.chatRoom.delete({
      where: { id: roomObjectId.toHexString() }, // ใช้ ObjectId เป็น string
    });

    return NextResponse.json({ message: 'Room and related messages deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting chat room:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
