# OMDA Studios - Complete Setup & Deployment Guide

## 📁 Folder Structure

```
omda-studios/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (admin user + sample data)
├── public/
│   └── uploads/               # Local media uploads (auto-created)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Redirects to /site
│   │   ├── site/               # Public-facing site
│   │   │   ├── layout.tsx      # Site layout (Navbar, Footer, Cursor)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── projects/       # Projects listing + detail
│   │   │   ├── about/          # About page
│   │   │   └── contact/        # Contact page
│   │   ├── admin/              # Admin dashboard (auth-protected)
│   │   │   ├── layout.tsx      # Admin layout (sidebar)
│   │   │   ├── login/          # Login page
│   │   │   ├── dashboard/      # Stats overview
│   │   │   ├── projects/       # CRUD projects
│   │   │   ├── messages/       # View/manage contact messages
│   │   │   ├── blog/           # Blog post management
│   │   │   ├── team/           # Team members
│   │   │   ├── testimonials/   # Testimonials
│   │   │   ├── services/       # Services management
│   │   │   ├── media/          # Media library
│   │   │   └── settings/       # About/site settings
│   │   └── api/                # API routes
│   │       ├── auth/           # NextAuth endpoint
│   │       ├── projects/       # Projects CRUD
│   │       ├── messages/       # Messages CRUD
│   │       ├── services/       # Services CRUD
│   │       ├── about/          # About CRUD
│   │       └── upload/         # File upload
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── sections/           # Page sections (Hero, Works, Services, CTA)
│   │   ├── animations/         # LoadingScreen, PageTransition, Reveal
│   │   └── admin/              # Admin UI components
│   ├── lib/
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── auth.ts             # NextAuth config
│   │   └── utils.ts            # Utilities
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── styles/
│   │   └── globals.css         # Global styles + custom cursor
│   └── middleware.ts           # Auth protection
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB database (MongoDB Atlas recommended)
- npm or pnpm

### Step 1 - Clone & Install

```bash
# Clone or download this project
cd omda-studios

# Install dependencies
npm install
```

### Step 2 - Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/omdastudios?retryWrites=true&w=majority"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-32-char-random-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_FOLDER="omda-studios"
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

### Step 3 - Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with admin user + sample data
npm run db:seed
```

### Step 4 - Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin Panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@omdastudios.com`
- Password: `admin123`

> ⚠️ Change the admin password immediately after first login via Settings.

---

## 🗄️ Database Options

### Option A: MongoDB Atlas (Recommended for production)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user and allow your app/server IP in Network Access
3. Copy the connection string and paste it in `DATABASE_URL`

### Option B: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB locally
3. Use a local URL like:

```env
DATABASE_URL="mongodb://127.0.0.1:27017/omdastudios"
```

> If local Prisma writes fail with a transaction error, run MongoDB as a replica set or use MongoDB Atlas.

---

## ☁️ Deployment on Vercel

### Step 1 - Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/omda-studios.git
git push -u origin main
```

### Step 2 - Import to Vercel
1. Go to [vercel.com](https://vercel.com) -> New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### Step 3 - Environment Variables on Vercel
In Vercel project -> Settings -> Environment Variables, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your MongoDB connection string |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Your 32-char secret |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Upload folder, e.g. `omda-studios` |

### Step 4 - Deploy
Click **Deploy** - Vercel handles the rest.

### Step 5 - Run Migrations on Production
After first deploy, run in Vercel console or locally with production env:
```bash
DATABASE_URL="your-mongodb-url" npm run db:push
DATABASE_URL="your-mongodb-url" npm run db:seed
```

---

## 🌐 Custom Domain Connection

### On Vercel:
1. Go to Project -> Settings -> Domains
2. Add your domain: `omdastudios.com`
3. Vercel provides DNS records

### DNS Configuration (at your registrar):
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Update Environment Variable:
```env
NEXTAUTH_URL="https://omdastudios.com"
```

---

## 🖼️ Media Uploads

Uploads are stored in **Cloudinary** and the returned secure URL is saved in MongoDB.

1. Create a Cloudinary account
2. Copy your cloud name, API key, and API secret
3. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and optional `CLOUDINARY_FOLDER` to `.env.local` and Vercel

---

## 🎨 Design Customization

### Colors (tailwind.config.ts)
```typescript
crimson: '#8B0000',   // Main accent
cream: '#F5F0EB',     // Background
charcoal: '#1a1a1a',  // Text
```

### Fonts (globals.css)
Currently using:
- **Playfair Display** - Display headings (editorial weight)
- **DM Sans** - Body text (clean, modern)
- **DM Mono** - Labels and monospace

To change fonts, update the Google Fonts import in `globals.css` and `--font-display`/`--font-body` CSS variables.

### Ticker Text
Edit `src/components/sections/TickerSection.tsx` - change the `items` array.

### Logo
Update the text `OMDASTUDIOS` in `Navbar.tsx` and `Footer.tsx`.

---

## 🔐 Admin Features

| Section | Features |
|---------|----------|
| **Dashboard** | Stats overview, recent messages |
| **Projects** | Create, edit, delete, publish/unpublish, featured toggle |
| **Messages** | View all contact submissions, mark read/replied/archived |
| **Blog** | Create and manage blog posts |
| **Team** | Add/edit team member profiles |
| **Testimonials** | Add/edit client testimonials |
| **Services** | Manage service offerings |
| **Media** | Upload images, copy URLs, delete files |
| **Settings** | Edit about section, contact info, social links |

---

## 📱 Mobile Optimization

- Hamburger menu with full-screen mobile nav
- Responsive typography with `clamp()` fluid sizing
- Touch-optimized project cards
- Optimized image loading with `next/image`
- Custom cursor disabled on touch devices automatically

---

## ⚡ Performance Tips

1. **Images**: Always use actual images in production. Replace placeholder `div` elements in `HeroSection.tsx` and project cards with real `next/image` components.

2. **Fonts**: Consider self-hosting fonts for better performance:
   ```bash
   npm install @next/font
   ```

3. **ISR**: Add `revalidate` to server components for static generation:
   ```typescript
   export const revalidate = 3600 // Revalidate every hour
   ```

4. **Image optimization**: Set proper image dimensions in `next/image` components.

---

## 🔧 Extending the Project

### Add a new admin page:
1. Create `src/app/admin/yourpage/page.tsx`
2. Add link to `src/components/admin/AdminSidebar.tsx`
3. Add API route at `src/app/api/yourresource/route.ts`
4. Add Prisma model to `prisma/schema.prisma`
5. Run `npm run db:push`

### Add animations to a component:
```typescript
import Reveal from '@/components/animations/Reveal'

<Reveal delay={0.2} direction="up">
  <YourComponent />
</Reveal>
```

---

## 🐛 Troubleshooting

**Database connection error:**
- Check `DATABASE_URL` format: `mongodb+srv://user:password@cluster.mongodb.net/omdastudios`
- Ensure MongoDB is running or your Atlas cluster is active
- Check MongoDB Atlas Network Access and database user permissions

**Auth not working:**
- Ensure `NEXTAUTH_SECRET` is set and at least 32 characters
- `NEXTAUTH_URL` must match your actual URL exactly

**Images not showing:**
- Ensure Cloudinary environment variables are set
- Ensure `res.cloudinary.com` is allowed in `next.config.js`

**Build errors:**
```bash
npm run build 2>&1 | head -50
```
Check for TypeScript errors and fix them before deploying.

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | MongoDB + Prisma ORM |
| Auth | NextAuth.js |
| Forms | React Hook Form + Zod |
| File Upload | Cloudinary |
| UI Icons | Lucide React |
| Toast Notifications | React Hot Toast |
| Deployment | Vercel |

---

*Built for OMDA Studios - premium creative agency website with full CMS.*
