import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

// สร้าง instance ของ PrismaClient เพื่อใช้เชื่อมต่อกับฐานข้อมูล
const prisma = new PrismaClient()

// ฟังก์ชันสำหรับจัดการคำขอแบบ POST เพื่อสร้างผู้ใช้ใหม่
export async function POST(request: Request) {
  try {
    // รับข้อมูลจาก body ของคำขอ (request body) และทำการ destructure ข้อมูลที่รับมา
    const { email, password, name }: { email: string; password: string; name: string } = await request.json()

    // แสดงข้อมูลที่รับมาใน console สำหรับการตรวจสอบ
    console.log('Request data:', { email, password, name })

    // เข้ารหัส (hash) รหัสผ่านของผู้ใช้ก่อนที่จะบันทึกลงฐานข้อมูล เพื่อเพิ่มความปลอดภัย
    const hashedPassword = bcrypt.hashSync(password, 10) // ใช้ bcrypt เพื่อเข้ารหัสโดยกำหนด salt round เท่ากับ 10
    console.log('Hashed password:', hashedPassword) // แสดงรหัสผ่านที่ถูกเข้ารหัสใน console สำหรับการตรวจสอบ

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล โดยใช้ Prisma ORM และบันทึกข้อมูลที่ถูกเข้ารหัสแล้ว
    const user = await prisma.user.create({
      data: {
        email, // อีเมลของผู้ใช้
        password: hashedPassword, // รหัสผ่านที่ถูกเข้ารหัส
        name, // ชื่อของผู้ใช้
      },
    })

    // แสดงข้อมูลของผู้ใช้ที่ถูกสร้างขึ้นใน console สำหรับการตรวจสอบ
    console.log('User created:', user)

    // ส่ง response กลับไปที่ client ในรูปแบบ JSON พร้อมข้อมูลผู้ใช้ที่ถูกสร้างขึ้น
    return NextResponse.json({ message: 'User created', user })
  } catch (error) {
    // กรณีที่เกิดข้อผิดพลาด จะแสดง error ใน console
    console.error('Error creating user:', error)

    // ส่ง response กลับไปที่ client แจ้งว่าไม่สามารถสร้างผู้ใช้ได้ พร้อม status code 500
    return NextResponse.json({ error: 'User could not be created' }, { status: 500 })
  }
}

