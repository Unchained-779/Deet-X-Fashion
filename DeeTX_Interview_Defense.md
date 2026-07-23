# DeeT-X Fashion — Interview Defense & Technical Q&A Master Guide

This document is dedicated exclusively to **Interview Prep & Technical Defense**. Review this file before placement interviews, mock drills, and project defense rounds.

---

## 1. Meta-Framework vs. Traditional MERN Architecture

### Q: Why use Next.js 14+ App Router instead of a traditional decoupled MERN stack (React + Express)?
- **Answer:** 
  1. **Server-Side Rendering & Zero Client Waterfall:** In traditional React (VakeelEasy), the browser downloads an empty HTML shell (`<div id="root"></div>`) and executes `useEffect()` to fetch data via `axios`. This creates a client waterfall and poor SEO. In Next.js Server Components, PostgreSQL data is fetched directly on the Node.js server, delivering fully populated HTML to the client on initial load.
  2. **Security Boundary:** Database credentials (Prisma, PostgreSQL connection strings) never leave the server memory.
  3. **Server Actions (`"use server"`):** Replaces traditional REST API routes (`app.post('/api/products')`) with server-side RPC functions, eliminating fetch/axios glue code and CORS management.

---

## 2. Dynamic Rendering & React Key Mechanics

### Q: Why is `key={product.id}` mandatory when mapping array items in JSX?
- **Answer:**
  1. **Virtual DOM Reconciliation:** React uses keys to track identity across renders. When an array changes (e.g. product deletion), React compares keys to determine which exact DOM node to mutate rather than destroying and re-creating the entire list.
  2. **Preventing State Bleed:** Without unique keys, component state (such as input focus, checkbox states, or animation frames) can incorrectly bleed into neighboring list items.

---

## 3. Server Components vs Client Components

### Q: When MUST a component be marked with `'use client'`?
- **Answer:** 
  1. Whenever the component requires **Event Listeners** (`onClick`, `onChange`, `onSubmit`).
  2. Whenever the component uses **React State or Lifecycle Hooks** (`useState`, `useEffect`, `useReducer`, `useContext`).
  3. Whenever using **Browser-Only APIs** (`window`, `localStorage`, `document`).
  - *Best Practice:* Keep Server Components as high up the tree as possible, pushing `'use client'` down to tiny leaf components (e.g. a specific `AddToCartButton`).

---

## 4. Prisma Database Connection Pooling & `globalThis`

### Q: Why do we cache the `PrismaClient` instance on `globalThis` in development?
- **Answer:**
  - Next.js development server (`npm run dev`) utilizes Hot Module Replacement (HMR) to re-evaluate module files on every save.
  - If we run `const prisma = new PrismaClient()` directly at top-level without caching, every file save instantiates a new database connection pool.
  - PostgreSQL has a strict max connection limit. Un-cached HMR rapidly exhausts connection sockets (`P1001 / P5010: Too Many Connections`). Caching on `globalThis` reuses the active connection pool across hot reloads.

---

## 5. Next.js Server Actions & Form Mutation Lifecycle

### Q: Walk me through what happens when a user submits the `NewProductPage` form.
- **Answer:**
  1. User fills out form fields (`name`, `price`, `category`, etc.) and clicks **Save Product**.
  2. The browser passes `FormData` to the Server Action (`action={createProduct}`).
  3. Next.js serializes `FormData` and sends a POST request to the internal RPC handler.
  4. Node.js executes `"use server"` function, running `await prisma.product.create({ data: ... })` inside server memory.
  5. On success, `redirect("/admin")` is invoked, triggering path revalidation and navigating the client browser to the updated dashboard.
