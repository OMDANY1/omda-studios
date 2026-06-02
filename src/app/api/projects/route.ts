import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  description: z.string().min(1),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  client: z.string().optional(),
  services: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().default(0),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')

    const projects = await prisma.project.findMany({
      where: published === 'true' ? { published: true } : undefined,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ data: projects })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...data,
        slug: data.slug || slugify(data.title),
      },
    })

    return NextResponse.json({ data: project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
