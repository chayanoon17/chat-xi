// app/api/auth/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth route working!' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'Received!', data: body });
}
