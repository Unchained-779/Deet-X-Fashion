# DeeT-X Fashion — Mistake Journal & Debugging Log
*Tagged: DeeT-X*

This journal logs every real-world bug, mistake, and syntax error encountered during the construction of DeeT-X, along with the root cause and Senior Engineer solution.

---

## 🛑 Mistake #1: Modifying `.env` Without Restarting Next.js Server
- **Symptom:** `PrismaClientInitializationError: Can't reach database server` even after pasting `DATABASE_URL`.
- **Root Cause:** Next.js loads environment variables from `.env` only at server startup. Newly created `.env` variables are NOT hot-reloaded automatically while `npm run dev` is active.
- **Solution:** Always restart `npm run dev` (`Ctrl+C` then `npm run dev`) whenever you add or modify keys in `.env`.

---

## 🛑 Mistake #2: Unclosed JSX Elements (`<div>` Mismatch)
- **Symptom:** `Syntax error` or cards stacking vertically instead of displaying side-by-side in Tailwind grid.
- **Root Cause:** Closing a container `</div>` too early (e.g. inside Card 1 instead of after Card 2) breaks the parent `grid` container layout.
- **Solution:** Always trace opening and closing tags. Every `<div className="grid...">` must enclose all grid child cards before closing `</div>`.

---

## 🛑 Mistake #3: Bleeding Prisma v7 Beta Config into Next.js
- **Symptom:** `Unknown property datasources provided to PrismaClient constructor` / `datasourceUrl` errors.
- **Root Cause:** Prisma v7 introduced breaking changes (`prisma.config.ts` and changes to `new PrismaClient()`). Next.js & Auth.js expect the standard Prisma v6 connection pattern.
- **Solution:** Lock dependencies to stable production versions (`prisma@6` and `@prisma/client@6`), use `url = env("DATABASE_URL")` in `schema.prisma`, and initialize with standard `new PrismaClient()`.

---

## 🛑 Mistake #4: Forgetting `"use server"` Directive in Server Actions
- **Symptom:** Prisma query attempts to run in the client browser, throwing security errors or leaking environment secrets.
- **Root Cause:** Next.js components and functions run on the server by default only if they are Server Components. Inside forms, functions passed to `action={...}` must be marked with `"use server"` so Next.js converts them into server-side RPC endpoints.
- **Solution:** Always add `"use server"` as the first line inside any form submission action function.

---

## 🛑 Mistake #5: Invisible Input Text in Form Styling
- **Symptom:** Typing into `<input>` fields works, but the text appears blank/invisible.
- **Root Cause:** Tailwind defaults or parent container inheritance set the text color to white on a white input background (`bg-white`).
- **Solution:** Explicitly add text color utility classes (`text-slate-900` or `text-black`) to form inputs.

---

## 🛑 Mistake #6: Missing Root Layout in App Router
- **Symptom:** `Missing <html> and <body> tags in the root layout` red screen error.
- **Root Cause:** Next.js App Router requires a top-level `src/app/layout.tsx` file containing `<html>` and `<body>` tags. Sub-layouts (like `src/app/admin/layout.tsx`) wrap inside the root layout.
- **Solution:** Always maintain `src/app/layout.tsx` as the master document wrapper.
