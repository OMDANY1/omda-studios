import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { testimonialCreateSchema } from '@/lib/admin-schemas'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getAdminSession()
    const testimonials = await prisma.testimonial.findMany({
      where: session ? undefined : { published: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ data: testimonials })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = testimonialCreateSchema.parse(body)
    const testimonial = await prisma.testimonial.create({ data })

    return NextResponse.json({ data: testimonial }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
