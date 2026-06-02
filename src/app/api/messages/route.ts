import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = messageSchema.parse(body)

    const message = await prisma.message.create({ data })

    return NextResponse.json({ data: message }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: messages })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
