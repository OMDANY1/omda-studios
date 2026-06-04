import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { teamMemberCreateSchema } from '@/lib/admin-schemas'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ data: team })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = teamMemberCreateSchema.parse(body)
    const member = await prisma.teamMember.create({ data })

    return NextResponse.json({ data: member }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
