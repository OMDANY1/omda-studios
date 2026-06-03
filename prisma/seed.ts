import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@omdastudios.com' },
    update: {},
    create: {
      email: 'admin@omdastudios.com',
      password: hashedPassword,
      name: 'OMDA Admin',
      role: 'SUPER_ADMIN',
    },
  })

  // Create About
  await prisma.about.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      headline: 'THE CURATOR',
      tagline: 'Art Director & Digital Architect',
      description:
        'OMDASTUDIOS is a digital sanctuary where radical minimalism meets visceral impact. We believe in the tension of the "creamy red" - a palette that breathes life into clinical precision.',
      philosophy:
        'We reject the templated web. Our philosophy is rooted in the physical world - typography that breathes and layouts that demand attention.',
      approach1:
        'Every pixel serves a purpose. We reject the clutter of traditional UI to allow the typography to act as the primary architectural element of the user experience.',
      approach2:
        'Physicality in digital spaces. By utilizing tonal shifts instead of borders, we create a sense of depth that feels like stacked fine paper.',
      estYear: '2018',
      location: 'London, UK / Remote',
      email: 'hello@omdastudios.com',
      instagram: 'https://instagram.com/omdastudios',
      linkedin: 'https://linkedin.com/company/omdastudios',
      behance: 'https://behance.net/omdastudios',
    },
  })

  // Create Services
  const services = [
    { title: 'Art Direction', order: 1 },
    { title: 'Digital Experience', order: 2 },
    { title: 'Visual Identity', order: 3 },
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  // Create Projects
  const projects = [
    {
      title: 'The Oxide Ritual',
      slug: 'the-oxide-ritual',
      category: 'Branding',
      tags: ['Branding', 'Identity'],
      description: 'A curated visual narrative where editorial precision meets raw brutalist expression.',
      featured: true,
      order: 1,
    },
    {
      title: 'Red Oxide Identity',
      slug: 'red-oxide-identity',
      category: 'Editorial',
      tags: ['Editorial', 'Visual Identity'],
      description: 'A minimalist project exploring the tension between crimson and silence.',
      featured: true,
      order: 2,
    },
    {
      title: 'Kanso Monograph',
      slug: 'kanso-monograph',
      category: 'Digital',
      tags: ['Digital', 'Web'],
      description: 'Japanese minimalism translated into digital precision.',
      featured: false,
      order: 3,
    },
    {
      title: 'Neo Noir',
      slug: 'neo-noir',
      category: 'Art Direction',
      tags: ['Art Direction', 'Fashion'],
      description: 'Redefining the visual identity for a high-concept fashion house inspired by the intersection of brutalism and organic decay.',
      client: 'Aethelgard',
      services: 'Visual ID, Editorial',
      role: 'Lead Curator',
      location: 'Tokyo / NYC',
      featured: true,
      order: 4,
    },
    {
      title: 'Crimson Monolith',
      slug: 'crimson-monolith',
      category: 'Branding',
      tags: ['Branding', 'Architecture'],
      description: 'Visual identity for Neo-Tokyo Architecture firm.',
      order: 5,
    },
    {
      title: 'Vanguard Editorial',
      slug: 'vanguard-editorial',
      category: 'Digital Design',
      tags: ['Digital Design', 'Creative Direction', 'Motion'],
      description: 'A high-fashion digital experience designed for the 2024 Paris Collection release. Focusing on brutalist layouts and rapid-cut motion.',
      featured: true,
      order: 6,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  console.log('Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
