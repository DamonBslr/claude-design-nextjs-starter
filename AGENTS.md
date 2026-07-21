<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
