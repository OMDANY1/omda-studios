import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Eye, EyeOff, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
}

export default async function AdminBlogPage() {
  const posts = await getPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal font-display">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          NEW POST
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">TITLE</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium hidden md:table-cell">CATEGORY</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium hidden lg:table-cell">DATE</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">STATUS</th>
              <th className="text-left px-6 py-4 text-xs tracking-widest text-gray-400 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-charcoal text-sm">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{post.excerpt}</p>
                  )}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {post.category ? (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    post.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-charcoal transition-colors inline-flex"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No posts yet.</p>
            <Link href="/admin/blog/new" className="text-crimson text-sm mt-2 inline-block hover:underline">
              Write your first post →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
