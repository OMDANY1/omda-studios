import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export const runtime = 'nodejs'

const blogPostUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
})

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getAdminSession()
    const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })

    if (!post || (!session && !post.published)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ data: post })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = blogPostUpdateSchema.parse(body)

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        ...data,
        slug: data.slug || (data.title ? slugify(data.title) : undefined),
        publishedAt:
          data.publishedAt !== undefined
            ? data.publishedAt
              ? new Date(data.publishedAt)
              : null
            : undefined,
      },
    })

    return NextResponse.json({ data: post })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    await prisma.blogPost.delete({ where: { slug: params.slug } })
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
