import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API on Yandex Cloud!',
    timestamp: new Date().toISOString(),
    runtime: process.env.NODE_ENV,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    message: 'POST received',
    echo: body,
    timestamp: new Date().toISOString(),
  })
}