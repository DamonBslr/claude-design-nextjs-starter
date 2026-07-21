# Drizzle schema guidance

## Type mapping

| Domain concept | Drizzle/Postgres |
|---|---|
| Better Auth ID | `text` |
| app-generated ID | `uuid().defaultRandom().primaryKey()` |
| short string | `varchar` only with a real length constraint |
| unbounded copy | `text` |
| integer counter | `integer` or `bigint` based on range |
| money/precise decimal | `numeric` with explicit precision/scale |
| instant | timezone-aware timestamp with `defaultNow()` |
| structured opaque payload | `jsonb` plus a runtime schema at the boundary |
| enumerable state | Postgres enum or text + check constraint |

Prefer normalized columns when values need filtering, uniqueness, joins, or
partial updates. Use JSONB for truly opaque/versioned payloads, not to avoid
schema design.

## User-owned table pattern

```ts
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("projects_user_id_idx").on(table.userId)],
)
```

Import the local Better Auth `user` table for the reference. Choose `cascade`,
`restrict`, or soft-delete behavior deliberately. The application must still
filter by `userId` on every select/update/delete.
Never accept this value from the request body.

## Migration review

Check generated SQL for:

- unintended drops, type narrowing, or non-null changes without backfill;
- missing indexes and foreign-key delete behavior;
- locks or rewrites on populated tables;
- defaults that mask missing application data;
- migration ordering and snapshot drift.

For destructive changes, split expand/backfill/contract across deploys.
