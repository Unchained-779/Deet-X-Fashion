# DeeT-X Personal Full-Stack Playbook

*This document tracks developer profile, recurring web dev mistakes, mastered patterns, and project feature status specifically for **DeeT-X Fashion**.*

---

## 🧠 Reasoning & Developer Profile (DeeT-X Scope)

### Strengths:
- **Strong Aesthetics & Design Sense:** Great instinct for modern typography, responsive Tailwind layouts, and micro-animations.
- **Real Business Focus:** Building for an actual physical garment store gives strong real-world motivation and domain clarity.

### Weaknesses & Risk Patterns to Monitor:
- **Boilerplate Waving:** Tendency to treat API setup, Prisma models, and config files as "plumbing" to copy-paste rather than code to scrutinize.
- **Server vs Client Boundary Leaks:** Accidentally importing server-only packages into client components or putting `'use client'` on pages that could remain Server Components.
- **Scope Creep Temptation:** Wanting to add multiple complex features before the primary Phase A differentiator is deployed and defensible.

---

## 🚨 Web Dev Mistake Journal (DeeT-X Tagged)

*(Check this list before writing new API endpoints or components)*

1. **Forgotten `await` on Async Calls:**
   - *Trap:* Next.js 14+ params, cookies, and Prisma calls are async. Forgetting `await` returns a pending promise and causes silent UI bugs.
   - *Fix:* Always inspect function signatures—if it returns `Promise<T>`, you MUST `await` it.

2. **Missing Loading & Error States:**
   - *Trap:* Leaving component screens blank while fetching data.
   - *Fix:* Always implement `loading.tsx` skeleton screens and `error.tsx` error boundaries in App Router route folders.

3. **Unvalidated Form Data:**
   - *Trap:* Trusting client-side form values directly inside Server Actions.
   - *Fix:* Always run input through a `zod` schema parser on the server side before passing to Prisma queries.

4. **Missing Key Props in Loops:**
   - *Trap:* Mapping over arrays (`products.map(...)`) without a unique `key={product.id}` prop.
   - *Fix:* Never use index as key if items can be reordered or deleted. Use unique database IDs.

---

## 🛡️ Mastered Patterns (DeeT-X Isolated)

> ⚠️ **Rule:** Mastery earned in other workspaces (e.g. VakeelEasy) does NOT carry over to DeeT-X. Patterns earn reduced scaffolding here ONLY after being written and gatekept twice inside this workspace.

| Pattern | Status | Verification Date |
| :--- | :--- | :--- |
| Next.js App Router Layouts & Routing | 🟡 In Progress | - |
| Server Actions + Zod Validation | 🟡 In Progress | - |
| Prisma Schema & Migrations | 🟡 In Progress | - |
| Zustand Cart State Management | 🔴 Not Started | - |
| Phase A Algorithmic Differentiator | 🔴 Not Started | - |

---

## 📋 Feature Ledger & Roadmap

- [ ] **Core Setup:** Next.js 14 + Tailwind CSS + Prisma + PostgreSQL schema.
- [ ] **Product Catalog:** Categories, product grid, product detail dynamic pages (`/products/[id]`).
- [ ] **Phase A Differentiator:** Algorithmic Recommendation / Ranking Engine.
- [ ] **Inventory System:** Real-time stock reservation locks.
- [ ] **Checkout Flow:** Razorpay integration + Webhook payment verification.
- [ ] **Admin Dashboard:** Order fulfillment status & analytics.
