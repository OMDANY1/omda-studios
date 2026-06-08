import type { MediaItem } from '@/lib/media'

export type { MediaItem }

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  description: string
  challenge?: string | null
  solution?: string | null
  client?: string | null
  services?: string | null
  role?: string | null
  location?: string | null
  year?: string | null
  coverImage?: string | null
  images: string[]
  gallery?: MediaItem[] | unknown
  featured: boolean
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Homepage {
  id: string
  heroTitle: string
  heroLabel?: string | null
  heroSubtitle?: string | null
  heroDescription?: string | null
  heroCtaText?: string | null
  heroCtaLink?: string | null
  heroMediaUrl?: string | null
  heroMediaMp4Url?: string | null
  heroMediaType: string
  heroPosterUrl?: string | null
  heroVideoEnabled: boolean
  tickerPhrases: string[]
  worksTitle?: string | null
  worksSubtitle?: string | null
  servicesLabel?: string | null
  servicesTitle?: string | null
  servicesDescription?: string | null
  ctaTitle?: string | null
  ctaSubtitle?: string | null
  ctaButtonText?: string | null
  ctaLink?: string | null
  featuredProjectIds: string[]
  updatedAt: Date
}

export interface SiteConfig {
  id: string
  siteName: string
  logoUrl?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords: string[]
  ogImage?: string | null
  siteUrl?: string | null
  updatedAt: Date
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  description?: string | null
  image?: string | null
  link?: string | null
  featured: boolean
  published: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description?: string | null
  icon?: string | null
  order: number
  published: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string | null
  image?: string | null
  email?: string | null
  linkedin?: string | null
  instagram?: string | null
  order: number
  published: boolean
}

export interface Testimonial {
  id: string
  name: string
  company?: string | null
  role?: string | null
  content: string
  image?: string | null
  rating: number
  published: boolean
  order: number
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string | null
  message: string
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  category?: string | null
  tags: string[]
  published: boolean
  featured: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface About {
  id: string
  headline: string
  tagline?: string | null
  description: string
  philosophy?: string | null
  approach1?: string | null
  approach2?: string | null
  image?: string | null
  estYear?: string | null
  location?: string | null
  email?: string | null
  phone?: string | null
  instagram?: string | null
  linkedin?: string | null
  behance?: string | null
}

export interface NavItem {
  label: string
  href: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
