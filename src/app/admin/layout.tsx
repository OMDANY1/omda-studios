import { getServerSession } from 'next-auth'
import AdminShell from '@/components/admin/AdminShell'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return <AdminShell user={session?.user}>{children}</AdminShell>
}
