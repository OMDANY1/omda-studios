import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

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
