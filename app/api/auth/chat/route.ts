import { NextRequest, NextResponse } from 'next/server';
import { ChatBedrockConverse } from '@langchain/aws';
import prisma from '../../../../lib/prisma';

const region = process.env.BEDROCK_AWS_REGION;
const accessKeyId = process.env.BEDROCK_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.BEDROCK_AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('AWS credentials are not set in the environment variables');
}

const llm = new ChatBedrockConverse({
  model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  region: region,
  streaming: true,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message: userMessage, chatRoomId } = await req.json();

    // ตรวจสอบว่า userMessage และ chatRoomId ส่งมาหรือไม่
    if (!userMessage || !chatRoomId) {
      return NextResponse.json({ 
        error: 'Both message and chatRoomId are required',
        message: `Received userMessage: ${userMessage}, chatRoomId: ${chatRoomId}`
      }, { status: 400 });
    }

    const messages = [{ role: 'user', content: userMessage }];
    console.log('User Message:', messages);

    // บันทึกข้อความจากผู้ใช้ลงฐานข้อมูล
    await prisma.message.create({
      data: {
        chatRoomId,
        sender: 'user', // ผู้ใช้ส่งข้อความ
        content: userMessage, // เนื้อหาของข้อความ
      }
    });

    // สตรีมคำตอบจาก AI
    const stream = await llm.stream(messages);
    const reader = stream.getReader();
    let aiResponse = ''; // คำตอบจาก AI ที่สะสมจาก chunk

    const readableStream = new ReadableStream({
      async pull(controller) {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();

          // เมื่อสตรีมเสร็จแล้ว บันทึกคำตอบ AI ลงฐานข้อมูล
          await prisma.message.create({
            data: {
              chatRoomId,
              sender: 'ai', // ตั้งว่าเป็น AI
              content: aiResponse, // คำตอบที่ได้จาก AI
            }
          });

          return;
        }

        // ควรเช็คว่า value.content มีข้อมูลหรือไม่
        const chunk = Array.isArray(value?.content) ? value.content.join('') : value?.content ?? '';
        console.log(chunk);
        aiResponse += chunk; // สะสมคำตอบจาก AI
        controller.enqueue(new TextEncoder().encode(chunk)); // ส่งข้อมูล chunk ไปให้ client
      },
    });

    // ส่งคำตอบกลับในรูปแบบสตรีม
    return new NextResponse(readableStream);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // ตรวจสอบว่า request มีการยืนยันการลบหรือไม่
    const { confirm } = await req.json();
    if (confirm !== true) {
      return NextResponse.json({ error: 'Deletion not confirmed' }, { status: 400 });
    }

    // ลบข้อความทั้งหมด
    const deletedMessages = await prisma.message.deleteMany({});
    return NextResponse.json({ 
      message: 'Messages deleted successfully', 
      deleted: deletedMessages.count 
    }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatRoomId = searchParams.get('chatRoomId');

    if (!chatRoomId) {
      return NextResponse.json({ error: 'chatRoomId is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
