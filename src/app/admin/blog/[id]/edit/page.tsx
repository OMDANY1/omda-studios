import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'

async function getPost(id: string) {
  return prisma.blogPost.findUnique({ where: { id } })
}

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Edit Post</h1>
        <p className="text-sm text-gray-500 mt-1">{post.title}</p>
      </div>
      <BlogForm post={post} />
    </div>
  )
}
