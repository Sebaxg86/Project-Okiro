# Project Okiro — Repository Instructions

## Sources of truth

Before implementing product behavior, read:

1. `Docs/Especificación funcional - Sistema XP.md`
2. `Docs/Especificación Funcional y Tecnológica - Project Okiro.md`

These documents define the product, scope, technology, and XP economy. The file
`Docs/Modelo de Datos y Políticas RLS — Project Okiro.md` is a later reference
document, but it is not authoritative when it conflicts with either source above.

## Invariants

- Keep the application mobile-first, accessible, and installable as a PWA.
- Use Next.js App Router, React, strict TypeScript, Tailwind CSS, Supabase, and pnpm.
- Keep XP calculation on trusted server paths once persistence is connected.
- Never allow consolidated XP, account level, or permanent attributes to decrease.
- Distinguish missing data from failed objectives.
- Treat closed weeks as immutable and preserve the historical rule version.
- Make XP mutations and weekly closing auditable and idempotent.
- Do not add out-of-MVP features without explicit approval.
- Do not expose Supabase privileged keys to browser code.

## Required checks

Run before handing off an implementation:

```bash
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```
