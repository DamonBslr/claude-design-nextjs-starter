# Mapping a design delta

## Ownership lookup

1. Resolve a changed screen through its `design-src:` traceability comment.
2. Check shared components before screen-local code.
3. Trace the screen to its thin `apps/web/app/**/page.tsx` route.
4. Trace dynamic props to `apps/web/lib/features/**` TODOs or implementations.
5. Never infer ownership from filename similarity alone.

## Classifications

### ui-only

Copy, tokens, layout, visual state, icons, static assets, and responsive behavior.
Write under `packages/ui/src/` only.

### ui-contract

The design changes a dynamic value, callback, or state already represented by a
screen prop. Update the UI contract and deterministic fixture/TODO adapter, then
record `/wire-backend` work. Do not alter a real feature implementation.

### route-change

A screen is added, removed, renamed, or moved in navigation. Update the screen and
the thinnest possible App Router file. Route files may compose, validate a session,
and call an existing adapter; visual markup stays in `packages/ui`.

### backend-follow-up

A new persisted entity, mutation, upload, external API, authorization rule, or
server-derived state appears. Build the visual state, add a typed TODO adapter
that does not pretend success, and hand it to `/wire-backend`.

### delete-or-rename

Use manifest/source mappings plus content evidence. Update traceability comments,
screen exports, and route topology. If the mapping is ambiguous, make it an open
question rather than guessing.

### ignore

Metadata, screenshots used only for comparison, reference code churn with no
visual intent, byte-identical assets, and prototype-only browser/device chrome.
Record why it is ignored.

## Security and server checks

Treat these as backend follow-ups, never UI sync work:

- any `@workspace/db/client` import;
- any use of `DATABASE_URL` or provider secrets;
- changes to schema or migrations;
- changes to Better Auth cookie/session policy;
- authorization decisions based only on Client Components or `proxy.ts`;
- a user ID supplied by a form instead of a validated session.

## Sanity checklist

- Every changed design path appears once in the plan.
- Every target is within the approved sync boundary.
- New screen exports and route files are listed.
- Every dynamic contract delta has a named TODO and `/wire-backend` follow-up.
- Every changed screen has a fidelity viewport.
- No design token change bypasses the repository brand constraints.
