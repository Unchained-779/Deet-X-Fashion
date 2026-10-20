# DEET-X ATELIER | Ultra-Luxury Editorial Fashion E-Commerce

> An enterprise e-commerce storefront for handcrafted Indian couture, heirloom silk sarees, and contemporary silhouettes. Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, **Express 5**, and **PostgreSQL with Prisma ORM**.

---

## 🏛️ System Architecture

```
[Client / Browser]
       │
       ├──> [Frontend: Next.js 16 (App Router)] ─── Port 3000
       │      • Cormorant Garamond + Plus Jakarta Sans + JetBrains Mono
       │      • Lenis Smooth Inertial Scrolling
       │      • Framer Motion Transitions (cubic-bezier [0.22, 1, 0.36, 1])
       │      • Full-Bleed 100dvh Runway Hero & Asymmetric Lookbook Bento
       │      • Split-Screen PDP with Lightbox & Indian 6-Digit PIN Logistics
       │      • Zustand Slide-Over Bag Drawer with Dynamic Shipping Progress
       │
       ├──> [Backend: Node.js + Express 5] ─── Port 5000
       │      • RESTful Domain Modules (Auth, Catalog, Orders, Logistics)
       │      • 6-digit Indian PIN Code Serviceability & OTP Delivery Verification
       │      • Razorpay Payment Gateway & Webhook Signature Verification
       │
       └──> [Database: PostgreSQL (Supabase / Prisma ORM)]
              • Product & ProductVariant Models with Atomic Transactions
              • Order Fulfillments, Inventory Management & Address Registry
```

---

## 📁 Repository Structure

```
deet-x-fashion/
├── src/                         # Next.js 16 Frontend Core
│   ├── app/                     # App Router pages and API routes
│   │   ├── admin/               # Atelier Management & Inventory Portal
│   │   ├── api/                 # Next.js API endpoints (Checkout, Logistics proxy)
│   │   ├── checkout/            # 256-Bit SSL Encrypted Checkout Flow
│   │   ├── products/[slug]/     # Split-screen Editorial PDP with Lightbox
│   │   ├── globals.css          # Tailwind v4 @theme design tokens
│   │   ├── layout.tsx           # Google Fonts & Lenis Scroll Provider root
│   │   └── page.tsx             # Runway Hero, Bento Lookbook & Archival Showcase
│   ├── components/              # Luxury Component Architecture
│   │   ├── CartDrawer.tsx       # Zustand + AnimatePresence Slide-Over Bag Drawer
│   │   ├── EditorialHero.tsx    # 100dvh Runway Video with Magnetic CTA
│   │   ├── LookbookGrid.tsx     # 12-Column Asymmetric Bento Category Showcase
│   │   ├── PDPClient.tsx        # Vertical Gallery, PIN Checker, Sizing Modal
│   │   ├── ProductCard.tsx      # Sharp 3:4 Aspect Portrait Cards with Cloudinary Blur
│   │   ├── SmoothScrollProvider.tsx # Lenis weighted inertia scroll engine
│   │   └── StorefrontNavbar.tsx # Scroll-aware transparent-to-frosted glass bar
│   ├── lib/                     # Prisma Client & Cloudinary URL/Blur Helpers
│   ├── store/                   # Zustand Cart Store with localStorage persistence
│   └── types/                   # TypeScript interfaces
├── backend/                     # Dedicated Express 5 Enterprise Backend
│   ├── src/
│   │   ├── config/              # Environment validation (Zod) & Prisma connection
│   │   ├── middlewares/         # Centralized error handling, CORS, Helmet
│   │   ├── modules/             # Auth, Catalog, Logistics, Orders, Webhooks
│   │   ├── server.ts            # Express server entry point (Port 5000)
│   │   └── app.ts               # Express application configuration
│   └── package.json
├── prisma/                      # PostgreSQL Schema & Seed Scripts
│   ├── schema.prisma
│   └── seed.ts
├── .env.example                 # Frontend environment template
└── package.json                 # Next.js frontend dependencies & scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20 or higher
- **PostgreSQL**: Cloud (Supabase / Neon) or Local instance

### 2. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Unchained-779/Deet-X-Fashion.git
cd Deet-X-Fashion

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL

# Run Prisma migrations & seed
npx prisma db push
npx prisma db seed

# Launch Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Backend Setup (Optional Logistics Engine)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on **[http://localhost:5000](http://localhost:5000)** with interactive Swagger docs at `/api-docs`.

---

## 💎 Design Philosophy & Standards
1. **Typography**: Cormorant Garamond (`--font-editorial`) for couture headlines, Plus Jakarta Sans (`--font-sans`) for navigation/body, and JetBrains Mono (`--font-mono`) for tabular INR pricing and SKU tags.
2. **Palette**: Warm Alabaster (`#FAF8F5`), Stone Cream (`#F3EFEA`), Obsidian (`#111111`), Burnished Bronze (`#9E7B4F`), and 1px Crisp Dividers (`#E5E0D8`).
3. **Geometry**: Razor-sharp `rounded-none` edges, `1px` structural borders, and strict `aspect-[3/4]` portrait ratios for all garment photography.
4. **Physics**: Custom cubic-bezier timing `[0.22, 1, 0.36, 1]` for a slow, heavy, luxury feel paired with Lenis smooth scrolling inertia.

---

## 📜 License
Private & Proprietary — Crafted for DeeT-X Fashion Atelier.
