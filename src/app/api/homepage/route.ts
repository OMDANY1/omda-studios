import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { HOMEPAGE_ID } from '@/lib/cms'

const homepageSchema = z.object({
  heroTitle: z.string().min(1).optional(),
  heroLabel: z.string().nullable().optional(),
  heroSubtitle: z.string().nullable().optional(),
  heroDescription: z.string().nullable().optional(),
  heroCtaText: z.string().nullable().optional(),
  heroCtaLink: z.string().nullable().optional(),
  heroMediaUrl: z.string().nullable().optional(),
  heroMediaType: z.enum(['image', 'video']).optional(),
  heroPosterUrl: z.string().nullable().optional(),
  heroVideoEnabled: z.boolean().optional(),
  tickerPhrases: z.array(z.string()).optional(),
  worksTitle: z.string().nullable().optional(),
  worksSubtitle: z.string().nullable().optional(),
  servicesLabel: z.string().nullable().optional(),
  servicesTitle: z.string().nullable().optional(),
  servicesDescription: z.string().nullable().optional(),
  ctaTitle: z.string().nullable().optional(),
  ctaSubtitle: z.string().nullable().optional(),
  ctaButtonText: z.string().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  featuredProjectIds: z.array(z.string()).optional(),
})

const defaultHomepage = {
  id: HOMEPAGE_ID,
  heroTitle: '',
  heroLabel: '',
  heroSubtitle: null,
  heroDescription: '',
  heroCtaText: null,
  heroCtaLink: null,
  heroMediaUrl: null,
  heroMediaType: 'image',
  heroPosterUrl: null,
  heroVideoEnabled: true,
  tickerPhrases: [] as string[],
  worksTitle: null,
  worksSubtitle: null,
  servicesLabel: null,
  servicesTitle: null,
  servicesDescription: null,
  ctaTitle: null,
  ctaSubtitle: null,
  ctaButtonText: null,
  ctaLink: null,
  featuredProjectIds: [] as string[],
}

export async function GET() {
  try {
    const homepage = await prisma.homepage.upsert({
      where: { id: HOMEPAGE_ID },
      update: {},
      create: defaultHomepage,
    })
    return NextResponse.json({ data: homepage })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = homepageSchema.parse(body)

    const homepage = await prisma.homepage.upsert({
      where: { id: HOMEPAGE_ID },
      update: { ...data, updatedAt: new Date() },
      create: { ...defaultHomepage, ...data },
    })

    revalidatePath('/site')
    revalidatePath('/')

    console.log('[Homepage] CMS save — revalidated /site:', {
      id: homepage.id,
      heroTitle: homepage.heroTitle,
      updatedAt: homepage.updatedAt,
    })

    return NextResponse.json({ data: homepage })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
