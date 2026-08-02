# Project Okiro 🚀

A mobile-first PWA that turns healthy habits and focused work into balanced, RPG-inspired personal progression.

## 🌐 Live Demo

> [Click here to view the live site](https://project-okiro.vercel.app)

## ⚙️ Technologies Used

- Next.js, React, and TypeScript
- Supabase Auth, PostgreSQL, and Row Level Security
- Tailwind CSS, Zod, Vitest, and Testing Library

## 📚 Description

This project was developed as a personal product-development initiative and includes:

- ✅ Email authentication, profile creation, and goal onboarding
- ✅ Private weight history separated from the XP economy
- ✅ A secure, responsive PWA foundation with per-user data isolation through Row Level Security
- ✅ Live weekly XP, provisional ranks, daily missions, attributes, streaks, and automatic weekly consolidation

## 🧭 Current Stage

The first application foundation is ready and includes:

- A responsive dashboard backed by real account data
- Profile, onboarding, goals, weekly-cycle, progress, and weight persistence
- Functional History, Progress, and Profile navigation
- Real exercise, sleep, meal, hydration, and programming records
- Server-calculated provisional XP with daily and weekly limits
- A live XP bar that responds immediately to positive and negative provisional XP
- Real-time weekly ranks from S through E with coverage safeguards
- Goal-aware daily missions with automatic completion and weekly bonus limits
- Five calculated attributes: Strength, Endurance, Vitality, Intelligence, and Discipline
- A configurable Intelligence activity with icon-based presets and a custom option
- Daily and weekly streaks with one-time milestone rewards
- Scheduled, auditable, and idempotent weekly closing with permanent progression
- Consolidated weekly reports with pillar scores and XP breakdowns
- Auditable recalculation, idempotent retries, editing, and soft deletion
- A tested initial XP domain module
- Cookie-based Supabase authentication for server and browser flows
- PWA metadata, application icon, and social preview metadata
- Email/password registration and sign-in with Supabase SSR
- A public landing page and onboarding-protected `/app` area

New accounts intentionally begin with empty activity and XP states; the application does not display representative user data. All visible progression is calculated from the signed-in user's real records.

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
