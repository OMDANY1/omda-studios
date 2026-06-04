import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { getCloudinary, getCloudinaryFolder } from '@/lib/cloudinary'
import type { UploadApiResponse } from 'cloudinary'

export const runtime = 'nodejs'

function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
  resourceType: 'image' | 'video' = 'image'
) {
  const filename = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-')
  const publicId = `${nanoid()}-${filename || 'upload'}`

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = getCloudinary().uploader.upload_stream(
      {
        folder: getCloudinaryFolder(),
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(result)
      }
    )

    uploadStream.end(buffer)
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only image and video uploads are supported' }, { status: 415 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploaded = await uploadToCloudinary(buffer, file.name, isVideo ? 'video' : 'image')
    const url = uploaded.secure_url

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url,
        publicId: uploaded.public_id,
        type: file.type,
        size: file.size,
      },
    })

    return NextResponse.json({ data: { url, media } }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: media })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
