import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  try {
    const body =
      req.headers.get('content-type')?.includes('application/json')
        ? await req.json()
        : Object.fromEntries(await req.formData())
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

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: messages })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
