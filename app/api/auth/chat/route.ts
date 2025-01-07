import { NextRequest, NextResponse } from 'next/server';
import { getLLMStream } from '../../../../services/bedrock'; // Import Bedrock service
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // รับข้อมูลจาก request
    const body = await req.json();
    const { message: userMessage, chatRoomId } = body;

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!userMessage || typeof userMessage !== 'string' || !chatRoomId || typeof chatRoomId !== 'string') {
      return NextResponse.json({
        error: 'Both message and chatRoomId are required',
        details: { userMessage, chatRoomId },
      }, { status: 400 });
    }

    const messages = [{ role: 'user', content: userMessage }];
    console.log('User Message:', messages);

    // บันทึกข้อความของผู้ใช้
    await prisma.message.create({
      data: {
        chatRoomId,
        sender: 'user',
        content: userMessage,
      },
    });

    // เรียกใช้ Bedrock เพื่อเริ่มสตรีมคำตอบ
    const stream = await getLLMStream(messages);
    const reader = stream.getReader();
    let aiResponse = '';

    // อ่านข้อมูลจากสตรีม
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

        const chunk = Array.isArray(value?.content)
          ? value.content.join('')
          : value?.content ?? '';
        console.log('Chunk received:', chunk);
        aiResponse += chunk;
        controller.enqueue(new TextEncoder().encode(chunk));
      },
    });

    // ส่งข้อมูลกลับเป็น readable stream
    return new NextResponse(readableStream);
  } catch (error) {
    console.error('Error in POST handler:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // รับข้อมูลจาก request
    const body = await req.json();
    const { confirm } = body;

    // ตรวจสอบว่าการลบได้รับการยืนยัน
    if (confirm !== true) {
      return NextResponse.json({ error: 'Deletion not confirmed' }, { status: 400 });
    }

    // ลบข้อความทั้งหมด
    const deletedMessages = await prisma.message.deleteMany({});
    return NextResponse.json({
      message: 'Messages deleted successfully',
      deleted: deletedMessages.count,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE handler:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // ดึง query parameter
    const { searchParams } = new URL(req.url);
    const chatRoomId = searchParams.get('chatRoomId');

    // ตรวจสอบว่ามี chatRoomId
    if (!chatRoomId || typeof chatRoomId !== 'string') {
      return NextResponse.json({ error: 'chatRoomId is required' }, { status: 400 });
    }

    // ดึงข้อความจากฐานข้อมูล
    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error in GET handler:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
