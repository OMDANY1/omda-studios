import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export const runtime = 'nodejs'

const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')
    const session = await getAdminSession()

    const posts = await prisma.blogPost.findMany({
      where:
        published === 'true' || !session
          ? { published: true }
          : undefined,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ data: posts })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = blogPostSchema.parse(body)

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug: data.slug || slugify(data.title),
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.published ? new Date() : null,
      },
    })

    return NextResponse.json({ data: post }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
