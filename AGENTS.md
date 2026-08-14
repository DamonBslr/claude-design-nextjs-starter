<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Unbranded starter

This repository has no brand. It ships the stock shadcn/ui theme (`neutral`
base color) with Geist Sans and Geist Mono, and that is deliberate — do not
introduce a house palette, a display typeface, or styling rules unless the
change is asked for.

- Colors, radius, and light/dark tokens: `packages/ui/src/styles/globals.css`.
  Use semantic tokens (`bg-background`, `text-primary`, `--chart-1`…) rather
  than raw color utilities.
- Fonts: `next/font` declarations in `apps/web/app/layout.tsx`, exposed as
  `--font-sans` / `--font-mono`. There is no separate heading face.
- The product name is the `APP_NAME` constant in `apps/web/lib/app-config.ts`.
  Never hardcode a product name in a component, email, or config.

## Claude Design workflow

- Use `design-import` for every new Claude Design share URL or local handoff.
- Use `claude-design-to-nextjs` once for the baseline implementation.
- Use `claude-design-sync` for later imported design versions.
- Use `wire-backend` for the reviewed Next.js + Neon/Drizzle + Better Auth
  implementation pipeline.

`design-src/` is an imported snapshot. Only `design-import` may write it.
Design sync may change presentation and explicitly planned thin route/TODO
adapters; it never changes schema, migrations, auth policy, env files, or real
data-access implementations.
