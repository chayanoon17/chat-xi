// api/auth/chat/route.ts
export const runtime = 'nodejs'; // ใช้ Node.js runtime
import { NextRequest, NextResponse } from 'next/server';
import { getLLMStream } from '../../../../services/openrouter';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { message: userMessage, chatRoomId: providedChatRoomId } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({
        error: 'Message is required',
      }, { status: 400 });
    }

    let chatRoomId = providedChatRoomId;

    if (!chatRoomId) {
      console.log('Creating new chat room');
      const newChatRoom = await prisma.chatRoom.create({
        data: {
          title: 
            userMessage.length > 20 ? userMessage.slice(0, 20) + '...' : userMessage,
          createdAt: new Date(),
          userId,
        },
      });
      chatRoomId = newChatRoom.id;
    }

    // บันทึกข้อความของผู้ใช้ลงในฐานข้อมูล
    await prisma.message.create({
      data: { 
        chatRoomId,
        sender: 'user',
        content: userMessage,
      },
    });

    // เรียกใช้ Bedrock เพื่อสตรีมคำตอบ
    const stream = await getLLMStream([{ role: 'user', content: userMessage }]);
    const reader = stream.getReader();
    let aiResponse = '';

    const readableStream = new ReadableStream({
      async pull(controller) {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();

          // บันทึกคำตอบ AI ลงฐานข้อมูล
          await prisma.message.create({
            data: {
              chatRoomId,
              sender: 'ai',
              content: aiResponse,
            },
          });

          return;
        }

        const chunk = Array.isArray(value?.content) ? value.content.join('') : value?.content ?? '';
        aiResponse += chunk;
        controller.enqueue(new TextEncoder().encode(chunk));
        
      },
    });

    // ส่งข้อมูลกลับไปที่ Frontend พร้อม chatRoomId
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'chatRoomId': chatRoomId, 
        'X-Accel-Buffering': 'no', 
      },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatRoomId = searchParams.get('chatRoomId');
    const cursor = searchParams.get('cursor'); // ใช้ Cursor-based Pagination

    const pageSize = 10; // ดึง 10 รายการต่อหน้า

    if (!chatRoomId) {
      return NextResponse.json({ error: 'chatRoomId is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
      take: pageSize,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }) // ใช้ Cursor-based Pagination

    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

