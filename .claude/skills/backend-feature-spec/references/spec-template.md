---
feature_slug: <slug>
status: draft
sequence: <n>
classifications: [read | mutation | route-handler | external-service | auth]
depends_on: []
source_todos: []
---

# <Feature name>

## Outcome

User-facing capability and success result.

## UI contract

List each consuming `packages/ui` screen and copy exact relevant prop/action types.

## Server entry points

Name Server Components, Server Actions, and/or Route Handlers and justify the
choice. Treat every action/handler as a public security boundary.

## Authentication and authorization

- Session validation helper:
- Allowed roles/actors:
- Ownership rule:
- Resource checks per operation:

## Data model

Tables, columns, types, indexes, uniqueness, relationships, delete behavior, and
expected cardinality. Better Auth user IDs are text keys in the local auth schema.

## Operations

For each read/write, state inputs, validation, query ownership predicate, output
view model, errors, idempotency, and cache invalidation.

## External services and env

Server-only variables, timeout/retry behavior, webhook verification, rate/usage
limits, or `none`. Never use `NEXT_PUBLIC_` for secrets.

## States and failure behavior

Loading, empty, validation, unauthorized, forbidden, not found, conflict, provider
failure, and retry behavior relevant to this feature.

## Acceptance criteria

- [ ] Exact UI contract preserved or approved contract delta documented.
- [ ] Unauthenticated and unauthorized paths are tested.
- [ ] User-owned queries cannot cross actor boundaries.
- [ ] Validation and error states are visible and deterministic.
- [ ] Relevant lint/typecheck/build/tests pass.

## Out of scope

Explicit exclusions and later work.
