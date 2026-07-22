---
feature_slug: organizations
status: approved
sequence: 1
classifications: [read, mutation, external-service, auth]
depends_on: [better-auth-foundation]
source_todos: []
---

# Organizations

## Outcome

Any user may create an account, but application access requires at least one
organization membership. A user without a membership creates an organization;
an invited user signs up or signs in with the invited email and joins that
organization. Multi-organization users can switch their active organization.

## UI contract

New app-owned presentation components consume narrow DTOs only:

```ts
type OrganizationSummary = {
  id: string
  name: string
  description: string | null
}

type OrganizationMemberView = {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  joinedAt: string
}

type PendingInvitationView = {
  id: string
  email: string
  role: "admin" | "member"
  expiresAt: string
}
```

Mutations return a discriminated `OrganizationActionResult` with success,
validation, unauthorized, forbidden, conflict, provider, and unexpected error
states. No raw Drizzle or Better Auth row is exposed to a Client Component.

## Server entry points

- Server Components call a cached organization data-access helper for the active
  membership, organization list, member list, and role-filtered invitations.
- Server Actions create/update organizations, set active organization, invite,
  resend/cancel invitations, update non-owner roles, and remove non-owners.
- Better Auth's existing Route Handler remains the entry point for sign-up,
  sign-in, invitation acceptance, and plugin operations.
- Resend is called only by Better Auth's server-side `sendInvitationEmail` hook.

## Authentication and authorization

- `requireSession()` validates the database-backed Better Auth session.
- `requireOrganization()` additionally verifies the active organization against
  the current user's memberships and redirects membership-less users to setup.
- Any member may read organization details and members.
- Owners/admins may update details, invite, cancel/resend invitations, update a
  non-owner between admin/member, and remove a non-owner.
- Every action derives the user and organization from the validated session,
  rechecks membership/role, and delegates mutation enforcement to Better Auth.
- Regular members cannot enumerate invitation IDs. Better Auth's broad
  `/organization/get-full-organization` and `/organization/list-invitations`
  paths are disabled; a role-gated server query supplies pending invites.

## Data model

- `organization`: Better Auth text ID, name, unique indexed slug, optional logo,
  optional metadata, optional description, and creation timestamp.
- `member`: Better Auth text ID, organization/user foreign keys with cascade
  deletion, role, creation timestamp, indexes for both foreign keys, and unique
  `(organization_id, user_id)` membership.
- `invitation`: Better Auth text ID, organization and inviter foreign keys,
  normalized email, role, status, expiry/creation timestamps, and indexes for
  organization, email, and pending lookup.
- `session.active_organization_id`: nullable text selected per session.

The optional organization description is limited to 1,000 characters at every
input boundary. Name is trimmed and limited to 1–100 characters. Slug is derived
server-side and is not editable in v1.

## Operations

- Signup: keep public email/password signup unchanged, then follow the safe
  callback. A protected callback redirects a membership-less user to setup.
- Create: validate name/description, derive a collision-resistant slug, create
  through Better Auth, set the organization active, and continue the callback.
- Accept invite: preserve `/accept-invitation/<opaque-id>` through auth, then
  automatically call Better Auth acceptance with the signed-in matching email.
- Switch: verify the requested organization belongs to the current user, set it
  active, refresh organization-dependent UI.
- Manage: read scoped member/invite DTOs, validate every input, call Better Auth
  server APIs, and revalidate `/organization` plus the app shell.
- Email: send a React Email invitation via Resend. Use an idempotency key based
  on invitation ID and expiry; a delivery error leaves a pending invitation that
  can be resent.

## External services and env

- Existing: `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- New server-only: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- `BETTER_AUTH_URL` supplies the absolute invitation origin.
- Remote migration, provider setup, verified sender DNS, deployment, and live
  email delivery require explicit approval outside this implementation.

## States and failure behavior

- Setup distinguishes validation, slug conflict, unauthorized session, and
  unexpected creation failures.
- Invitation acceptance distinguishes wrong email, missing/expired/used invite,
  membership limit, and unexpected failures; a user without membership can
  recover by creating an organization.
- Management distinguishes read-only member state, conflicts, provider delivery
  failure with resend, and forbidden cross-organization operations.
- A missing or stale active organization is replaced with the first current
  membership; no membership redirects to setup.

## Acceptance criteria

- [ ] Open signup remains available and protected access requires membership.
- [ ] New users can create and activate an organization as owner.
- [ ] Invited new/existing users automatically join after matching-email auth.
- [ ] Multi-organization switching is membership-scoped.
- [ ] Members can read details/members; owner/admin mutations are enforced on the server.
- [ ] Regular members cannot enumerate pending invitation IDs.
- [ ] Resend delivery is server-only and retry-safe.
- [ ] Unauthenticated, stale-session, wrong-role, cross-organization, invalid,
      expired, duplicate, and provider-failure paths are covered.
- [ ] Migration SQL is reviewed and lint, tests, typecheck, and build pass where
      local environment configuration permits.

## Out of scope

Teams, custom roles, domain auto-join, SSO, billing limits, public invite links,
organization deletion, ownership transfer, and leave-organization UI.
