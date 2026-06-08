import BlogForm from '@/components/admin/BlogForm'

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">New Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new journal entry</p>
      </div>
      <BlogForm />
    </div>
  )
}
