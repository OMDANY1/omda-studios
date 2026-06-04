import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, unauthorizedResponse } from '@/lib/api-auth'
import { teamMemberUpdateSchema, withoutUndefined } from '@/lib/admin-schemas'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const member = await prisma.teamMember.findUnique({ where: { id: params.id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ data: member })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    const body = await req.json()
    const data = withoutUndefined(teamMemberUpdateSchema.parse(body))
    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ data: member })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) return unauthorizedResponse()

  try {
    await prisma.teamMember.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
