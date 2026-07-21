# Backend feature discovery

## Signals

- List/detail content implies reads and ownership filtering.
- Submit/save/delete/archive implies a mutation and error/optimistic state.
- Current-user content implies real Better Auth validation.
- Roles/teams/sharing imply authorization beyond authentication.
- Upload/download implies size/type limits, storage choice, and usually a Route
  Handler.
- Webhook/public API implies a Route Handler with signature/auth validation.
- Provider-generated content implies a server-only secret, timeout, retry, quota,
  and abuse controls.
- Search/filter/sort implies indexed query requirements.
- Notifications/background work imply an explicit job/delivery system.

## Clustering

Group TODOs when they deliver one user-visible outcome and share a data lifecycle.
Split when they have independent acceptance criteria, security boundaries,
external dependencies, or rollout risk.

## Ordering

1. Session and actor identity
2. Ownership/role model
3. Core schema
4. Read paths
5. Mutations
6. Uploads/external services/webhooks
7. Derived analytics and background work

## Questions that block implementation

- Who owns the record and who else may read/write it?
- Is deletion soft or hard?
- Which fields are user input versus server-derived?
- What is the expected cardinality and ordering?
- Are duplicate submissions idempotent?
- What happens when the external service times out?
- Which states must the UI distinguish?
