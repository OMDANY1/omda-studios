import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@prisma/client'

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPost(slug: string) {
  try {
    return await fetchApi<BlogPost>(`/api/blog/${slug}`)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt ?? undefined }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <>
      <section className="relative bg-charcoal min-h-[50vh] flex items-end overflow-hidden pt-14">
        <div className="absolute inset-0">
          {post.coverImage ? (
            <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-40" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:px-10 pb-16 w-full max-w-4xl">
          {post.category && (
            <p className="text-label text-crimson mb-4">{post.category.toUpperCase()}</p>
          )}
          <h1
            className="font-display font-black text-cream leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-cream/70 max-w-2xl text-base md:text-lg leading-relaxed">{post.excerpt}</p>
          )}
          <p className="text-label text-cream/40 mt-8">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-10 py-20">
        <Reveal>
          <article className="max-w-3xl mx-auto prose prose-lg prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-p:text-mid-gray prose-a:text-crimson">
            <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed text-mid-gray">
              {post.content}
            </div>
          </article>
        </Reveal>

        {post.tags.length > 0 && (
          <Reveal delay={0.2} className="max-w-3xl mx-auto mt-12 pt-8 border-t border-charcoal/10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-label bg-cream-dark px-3 py-1 text-charcoal">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <div className="bg-cream px-6 md:px-10 py-8 border-t border-charcoal/10">
        <Link
          href="/blog"
          className="text-label text-charcoal hover:text-crimson transition-colors"
        >
          BACK TO JOURNAL
        </Link>
      </div>

      <CtaSection />
    </>
  )
}
