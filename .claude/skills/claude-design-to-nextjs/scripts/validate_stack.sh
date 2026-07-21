#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "x $1" >&2
  exit 1
}

[ -f package.json ] || fail "run from the repository root"
[ -f apps/web/package.json ] || fail "apps/web/package.json is missing"
[ -f packages/ui/package.json ] || fail "packages/ui/package.json is missing"
[ -f packages/db/package.json ] || fail "packages/db/package.json is missing"
[ -f apps/web/lib/auth.ts ] || fail "apps/web/lib/auth.ts is missing"
[ -f apps/web/lib/auth-client.ts ] || fail "apps/web/lib/auth-client.ts is missing"
[ -f apps/web/app/api/auth/'[...all]'/route.ts ] || fail "Better Auth route handler is missing"

node -e '
const fs = require("node:fs");
const root = JSON.parse(fs.readFileSync("package.json", "utf8"));
const web = JSON.parse(fs.readFileSync("apps/web/package.json", "utf8"));
const db = JSON.parse(fs.readFileSync("packages/db/package.json", "utf8"));
const dep = (pkg, name) => ({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies })[name];
if (!String(root.packageManager || "").startsWith("bun@")) throw new Error("root packageManager must be bun");
if (!String(dep(web, "next") || "").match(/16\./)) throw new Error("apps/web must use Next.js 16");
if (!dep(db, "@neondatabase/serverless") || !dep(db, "drizzle-orm")) throw new Error("packages/db must use Neon + Drizzle");
if (!dep(web, "better-auth")) throw new Error("apps/web must use Better Auth");
' || fail "stack validation failed"

echo "ok Next.js 16 + Neon/Drizzle + Better Auth foundation detected"
