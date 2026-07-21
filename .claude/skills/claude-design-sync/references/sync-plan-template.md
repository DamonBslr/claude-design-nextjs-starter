# Design Sync Plan

- **from_commit:** `<full sha>`
- **to_commit:** `<full sha>`
- **source_label:** `<manifest label>`
- **imports:** `<count>`
- **date:** `<YYYY-MM-DD>`
- **boundary:** presentation plus explicitly listed thin route/TODO adapters only;
  no design-src, database, migration, auth, proxy, env, or deployment changes.

## Imports

List import commits in order.

## Per-file mapping

| design-src path | change | classification | target | notes |
|---|---|---|---|---|
| `screens/projects.html` | modified | ui-only | `packages/ui/src/screens/projects-screen.tsx` | spacing and empty state |
| `screens/project.html` | added | route-change | UI screen + `apps/web/app/projects/[id]/page.tsx` | thin route shell |
| `PROMPT.md` | modified | backend-follow-up | `apps/web/lib/features/projects.ts` TODO only | adds archive mutation |
| `MANIFEST.json` | modified | ignore | - | source metadata and mapping evidence |

## Screen exports and route topology

List exports, route additions/removals, layouts, loading/error boundaries, and
navigation effects.

## Backend follow-ups

For each dynamic delta:

- **contract:** exact screen prop/action affected;
- **TODO:** adapter path and symbol;
- **why:** new read/write/auth/external behavior;
- **next:** `/wire-backend <feature-slug>`.

## Fonts and assets

List locally bundled fonts and asset changes, or `none`.

## Verification

- [ ] `bun run lint`
- [ ] `bun run typecheck`
- [ ] `bun run build`

| screen/route | viewport | result | approved deviations |
|---|---:|---|---|
| `/projects` | `390x844` | pending | none |
| `/projects` | `1440x900` | pending | responsive reflow |

## Open questions and risks

List ambiguous routes, contract changes, brand conflicts, and anything requiring
schema/auth/backend review.
