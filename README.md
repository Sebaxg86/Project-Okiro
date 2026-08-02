# Project Okiro 🚀

A mobile-first PWA that turns healthy habits and focused work into balanced, RPG-inspired personal progression.

## 🌐 Live Demo

> [Click here to view the live site](https://your-live-link.com)

## ⚙️ Technologies Used

- Next.js, React, and TypeScript
- Supabase (Auth, PostgreSQL, Row Level Security, Edge Functions, Cron, and Storage)
- Tailwind CSS and shadcn/ui

## 📚 Description

This project was developed as a personal product-development initiative and includes:

- ✅ Daily tracking for exercise, sleep, nutrition, hydration, and programming sessions
- ✅ An auditable XP system with levels, attributes, weekly ranks, missions, streaks, and reports
- ✅ A secure, responsive, installable PWA with per-user data isolation through Row Level Security

## 🧭 Current Stage

The first application foundation is ready and includes:

- A responsive, mobile-first progress dashboard
- Interactive daily missions and quick activity logging
- Weekly XP, rank, streak, pillar, and recent-activity views
- A tested initial XP domain module
- Cookie-based Supabase authentication foundations for server and browser flows
- PWA metadata, application icon, and social preview metadata
- Email/password registration and sign-in with Supabase SSR
- A public landing page and protected `/app` dashboard

The dashboard currently uses representative habit data while persistent activity records are connected.

## 💻 Local Development

```bash
corepack pnpm install
corepack pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

Copy `.env.example` to `.env.local` before connecting a Supabase project.

## 📐 Sources of Truth

Product and implementation decisions are governed by:

- `Docs/Especificación funcional - Sistema XP.md`
- `Docs/Especificación Funcional y Tecnológica - Project Okiro.md`

The data-model and RLS document is supplementary and must be reconciled against these two specifications before implementation.

## 👨‍💻 Author

**Sebastián Chairez**  
Software Engineer  
[GitHub Profile](https://github.com/sebaxg86)
