import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SITE_CONFIG_ID } from '@/lib/cms'

const siteConfigSchema = z.object({
  siteName: z.string().min(1).optional(),
  logoUrl: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  metaKeywords: z.array(z.string()).optional(),
  ogImage: z.string().nullable().optional(),
  siteUrl: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: SITE_CONFIG_ID },
      update: {},
      create: { id: SITE_CONFIG_ID, siteName: 'OMDA Studios', metaKeywords: [] },
    })
    return NextResponse.json({ data: config })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = siteConfigSchema.parse(body)

    const config = await prisma.siteConfig.upsert({
      where: { id: SITE_CONFIG_ID },
      update: { ...data, updatedAt: new Date() },
      create: { id: SITE_CONFIG_ID, siteName: 'OMDA Studios', metaKeywords: [], ...data },
    })

    return NextResponse.json({ data: config })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
