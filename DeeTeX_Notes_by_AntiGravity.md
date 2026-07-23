# DeeT-X Notes by AntiGravity
*(Full-Stack Development Theory & Architecture Cheat Sheet)*

This document contains the core theoretical architecture, Next.js 14+ App Router guidelines, database design principles, and Phase A differentiator specs for **DeeT-X Fashion E-Commerce**.

---

## 📝 NOTEBOOK ENTRY: The Full-Stack Architecture Lifecycle
Whenever you build a feature in DeeT-X, trace the data through this exact 6-stage pipeline:

```
[User Action in Browser] 
       │
       ▼
[Client Component / Form] ──(Validation via Zod)──► [Next.js Server Action / API Route]
                                                                │
                                                        (Prisma ORM Query)
                                                                │
                                                                ▼
[UI Re-render / Toast] ◄──(JSON Response / Revalidate)─── [PostgreSQL DB]
```

### The 6 Stages:
1. **User Action:** User clicks a button (e.g. "Add to Cart", "Filter by Category").
2. **Client Boundary:** Client component handles local interaction state (e.g. loading spinner, optimistically updating UI).
3. **Server Action / API:** Requests hit Next.js Server Actions with strict input validation using `zod`.
4. **Data Layer:** Prisma queries PostgreSQL with explicit transaction handling (`prisma.$transaction`) when mutating multiple tables (e.g. reserving stock + creating order).
5. **Response & Revalidation:** Next.js revalidates cache paths (`revalidatePath`) or returns structured JSON.
6. **UI Synchronization:** State updates cleanly without full-page reloads.

---

## 📝 NOTEBOOK ENTRY: Next.js 14+ App Router Conventions

### 1. Server vs Client Components (`'use client'`)
* **Default is Server Component:** Everything inside `app/` is a Server Component by default. Server components fetch data directly without API overhead and ship zero JS to the client.
* **When to use `'use client'`:** ONLY when you need event listeners (`onClick`, `onChange`), React hooks (`useState`, `useEffect`, `useContext`), or browser APIs.
* **Golden Rule:** Push client components to the leaves of your component tree. Wrap only interactive elements (e.g. a `LikeButton`), not the whole page.

### 2. Form Handling & Server Actions
```typescript
// Server Action pattern with Zod validation
'use server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const ProductSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
})

export async function createProduct(formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    title: formData.get('title'),
    price: Number(formData.get('price')),
    stock: Number(formData.get('stock')),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  await prisma.product.create({ data: validatedFields.data })
}
```

---

## 📝 NOTEBOOK ENTRY: E-Commerce Data Schema (Prisma & Postgres)

Core models required for production e-commerce:
* **User & Auth:** `User`, `Account`, `Session`, `Address` (Shipping/Billing).
* **Catalog:** `Product`, `Category`, `ProductVariant` (Size, Color, SKU), `ProductImage`.
* **Inventory:** `StockLevel` (Available, Reserved), `StockLog` (Prevents overselling under race conditions).
* **Checkout & Orders:** `Cart`, `CartItem`, `Order`, `OrderItem`, `PaymentTransaction` (Razorpay/Stripe details).

---

## 📝 NOTEBOOK ENTRY: Phase A Differentiator Blueprint (DeeT-X Focus)

DeeT-X is being built for a real business (garments shop). To make this project stand out on resumes, it gets **ONE** algorithmically non-trivial differentiator built directly during construction:

### Differentiator Options (Choose ONE):
1. **Algorithmic Recommendation Engine:** Collaborative filtering or content-based recommendation matrix based on user browsing history and garment metadata.
2. **Fuzzy & Smart Search Engine:** Custom vector/similarity or trie-based search engine with auto-correct and category ranking.
3. **Fulfillment & Inventory Priority Queue:** Algorithm to optimize order dispatch based on stock availability across warehouses/stores and delivery distance.

### Real Domain Depth (Required alongside the differentiator):
- **Real Inventory Tracking:** Stock levels with reservation locks during checkout (not just a static `quantity` number).
- **Payment Gateway:** Real integration (Razorpay/Stripe webhooks with double-spend verification).
- **Admin Analytics:** Best-sellers, revenue trends, low-stock warnings.

---

## 📝 NOTEBOOK ENTRY: Anti-Copy-Paste & Gatekeeper Protocol

Before pasting or accepting any full-stack boilerplate in DeeT-X, you must answer:
1. **Mechanics:** What does this line/schema/hook do?
2. **Why-This-Not-That:** Why Server Actions vs API routes? Why Zustand vs Context?
3. **Failure Mode:** What happens if DB goes down, network drops, or input is malicious?
