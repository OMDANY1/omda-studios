import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import { fetchApi } from '@/lib/fetch-api'
import { formatDate } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Blog',
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function getPosts() {
  return fetchApi<BlogPost[]>('/api/blog?published=true')
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <section className="bg-cream pt-28 pb-0 px-6 md:px-10">
        <Reveal>
          <div className="mb-16">
            <h1
              className="font-display font-black leading-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 12rem)' }}
            >
              <span className="text-charcoal block">STUDIO</span>
              <span className="text-crimson block">JOURNAL</span>
            </h1>
            <p className="text-sm text-mid-gray mt-6 max-w-md">
              Notes on process, direction, and the craft behind our work.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-charcoal/10">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block border-b border-r-0 md:border-r border-charcoal/10 h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
                  )}
                  {post.featured && (
                    <div className="absolute top-4 right-4 bg-crimson px-3 py-1">
                      <span className="text-label text-cream">FEATURED</span>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {post.category && (
                        <p className="text-label text-light-gray mb-2">{post.category.toUpperCase()}</p>
                      )}
                      <h2 className="font-display font-black text-xl md:text-2xl uppercase text-charcoal group-hover:text-crimson transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-mid-gray mt-2 line-clamp-3">{post.excerpt}</p>
                      )}
                      <p className="text-label text-light-gray mt-4">
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-crimson opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {posts.length === 0 && (
          <Reveal>
            <p className="text-sm text-mid-gray py-20 border-t border-charcoal/10">
              No published posts yet. Check back soon.
            </p>
          </Reveal>
        )}
      </section>

      <CtaSection />
    </>
  )
}
