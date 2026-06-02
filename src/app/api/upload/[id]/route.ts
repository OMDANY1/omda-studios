import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCloudinary } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
    })

    if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 })

    if (media.publicId) {
      await getCloudinary().uploader.destroy(media.publicId, { resource_type: 'image' })
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
