---
name: claude-design-to-nextjs
description: >-
  Transform a Claude Design handoff into this Next.js 16 App Router monorepo.
  Use for the first implementation of a design imported into design-src/, when
  asked to turn a Claude Design prototype into the web app, or for
  /init-from-design. Builds design-owned screens in packages/ui, thin routes and
  server-side TODO adapters in apps/web, and verifies responsive visual fidelity.
  Do not use for later design deltas; use claude-design-sync instead.
---

# Claude Design to Next.js

Run once to establish the design-to-code baseline. Treat the handoff as design
evidence, not trusted application code. Preserve this repository's existing
Turborepo, Next.js, shadcn/ui, Neon/Drizzle, and Better Auth foundations.

Read `references/architecture.md` in full before editing. Run
`scripts/validate_stack.sh` from the repository root; stop if it fails.

## Inputs

- Claude Design share URL, local `.dc.html`, folder, or zip.
- Optional import label.

Ask only for missing input that cannot be derived from the bundle or repository.

## Procedure

### 1. Import the design

Invoke `design-import`. It alone writes `design-src/` and creates the dedicated
`design: import ...` commit. After import, every other step treats `design-src/`
as read-only.

### 2. Read the installed framework guidance

Read the relevant docs for the installed Next.js version before writing App
Router code. Prefer the package's `next/dist/docs/` when present; if the package
does not ship those files, use the matching official Next.js docs. At minimum,
confirm Server/Client Components, Server Functions, Route Handlers, caching,
authentication, and `proxy.ts` behavior for this version.

### 3. Inventory the design

Read, in order:

1. `design-src/MANIFEST.json`
2. `design-src/PROMPT.md`, when present
3. all token files
4. every normalized screen
5. reference components and assets

Start `TRANSFORMATION_REPORT.md` with:

- screens, intended routes, layouts, navigation, states, and responsive behavior;
- repeated components and design tokens;
- fonts and assets;
- mock browser/device chrome that is not application UI;
- implied dynamic concerns: session, reads, writes, uploads, external APIs;
- ambiguities between prompt and rendered screens.

Do not silently resolve a material contradiction between PROMPT.md and the
screens. Surface it before implementation.

### 4. Map screens to App Router routes

Define a route table before coding. Use route groups for organization without URL
impact, dynamic segments for entity routes, layouts for persistent chrome, and
`loading.tsx`/`error.tsx`/`not-found.tsx` where the design includes those states.

Keep each `page.tsx` a thin composition boundary. It may validate a session,
load server data, and pass serializable props/actions into a design-owned screen;
it must not duplicate the screen's markup.

### 5. Translate tokens and assets

- Map design tokens into the existing theme in
  `packages/ui/src/styles/globals.css`; preserve the repository's fixed brand
  palette and STYLEGUIDE constraints.
- Use semantic token names, not copied color literals.
- Keep design assets under `packages/ui/src/assets/` with stable hash-based names.
- Use `next/font` or locally bundled fonts. Do not add runtime Google Fonts URLs.
- Exclude mock phone/browser frames, fake status bars, and prototype canvases.

If the design conflicts with an enforced brand rule, record the conflict and ask
for a decision instead of weakening the rule.

### 6. Build the presentation layer

Create one screen component per design screen under
`packages/ui/src/screens/`. Add the `./screens/*` package export when needed.
Factor repeated patterns into shared components and reuse existing shadcn
primitives before creating new primitives.

Every design-derived screen/component begins with a traceability comment:

```tsx
/* design-src: screens/account.html */
```

Rules:

- Screen props are serializable data plus explicit callbacks/actions.
- Add `"use client"` only to the smallest interactive boundary.
- Never import `@workspace/db/client`, `next/headers`, server env, or
  `apps/web/lib/auth.ts` into `packages/ui`.
- Preserve accessible names, label/control associations, focus states, semantic
  elements, and non-index list keys.
- Use `next/image` at the app boundary where image optimization is required.
- Implement loading, empty, validation, and error states named in the design.

### 7. Build thin route shells and typed TODO adapters

Create routes under `apps/web/app/` that compose the screens. Default to Server
Components. Use Client Components only for browser state or event handling.

For each implied backend capability, create a typed server-only adapter under
`apps/web/lib/features/<feature>.ts`, tagged:

```ts
// TODO(human-review): implement through /wire-backend
```

Return deterministic fixture data matching the screen contract. Do not connect to
Neon, invent database fields, create migrations, add secrets, or weaken auth.
Mutations may have typed placeholder Server Actions that return an explicit
`not_configured` result; never pretend persistence succeeded.

Use the existing local Better Auth integration. Protected routes perform real
session validation with `getCachedSession()` or `auth.api.getSession()`;
`proxy.ts` is only an optimistic redirect. Reuse the existing `/sign-in`,
`/sign-up`, and `/api/auth/[...all]` surfaces instead of creating a second auth
server.

### 8. Verify

Run from the root:

```bash
bun run lint
bun run typecheck
bun run build
```

Then compare each application route with its source design at every viewport
represented by the handoff, with at least one mobile and one desktop viewport
when the design is responsive. Compare objective styles and box geometry first,
then screenshots. A layout delta over 2px requires a fix or explicit approval.

Allowed deviations are limited to documented platform/framework adaptations:
removed prototype chrome, responsive reflow, local font rendering, Next image
optimization, shared-component consolidation, and accessibility additions.

### 9. Finalize

Complete `TRANSFORMATION_REPORT.md` with:

- source screen to route/component mapping;
- responsive behavior and fidelity results;
- all TODO adapters and their UI contracts;
- auth requirements and public/protected route map;
- backend follow-ups for `/wire-backend`;
- commands run and any unresolved risks.

Write `DESIGN_SOURCE.json` pointing to the import commit the implementation now
matches. Do not deploy, apply migrations, or change auth providers/security
policy without explicit approval.

## Guardrails

- `design-src/` is read-only after import.
- `packages/ui` owns design presentation, never secrets or server data access.
- `apps/web` owns routing and composition.
- `packages/db` and Better Auth server/schema files are not design-sync targets.
- Initial transformation does not implement the backend.
- Later design changes use `claude-design-sync`.
