import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { mediaUpdateSchema, withoutUndefined } from '@/lib/admin-schemas'
import { z } from 'zod'

export const runtime = 'nodejs'

function getResourceType(mimeType: string): 'image' | 'video' {
  return mimeType.startsWith('video/') ? 'video' : 'image'
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = withoutUndefined(mediaUpdateSchema.parse(body))

    const media = await prisma.media.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ data: media })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
    })

    if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

    if (media.publicId) {
      await getCloudinary().uploader.destroy(media.publicId, {
        resource_type: getResourceType(media.type),
      })
    }

    await prisma.media.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
