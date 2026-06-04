import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { galleryToLegacyImages } from '@/lib/media'

const mediaItemSchema = z.object({
  url: z.string().min(1),
  type: z.enum(['image', 'video']),
})

const projectUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().min(1).optional(),
    challenge: z.string().nullable().optional(),
    solution: z.string().nullable().optional(),
    client: z.string().nullable().optional(),
    services: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    images: z.array(z.string()).optional(),
    gallery: z.array(mediaItemSchema).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    order: z.number().optional(),
  })
  .strict()

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({ where: { id: params.id } })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: project })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = projectUpdateSchema.parse(body)

    const updateData: Record<string, unknown> = { ...data }

    if (data.gallery !== undefined) {
      updateData.gallery = data.gallery
      updateData.images = galleryToLegacyImages(data.gallery)
    } else if (data.images !== undefined) {
      updateData.gallery = data.images.map((url) => ({ url, type: 'image' as const }))
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    })
    return NextResponse.json({ data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.project.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
