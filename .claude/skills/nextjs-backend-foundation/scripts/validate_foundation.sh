#!/usr/bin/env bash
set -euo pipefail

fail() { echo "x $1" >&2; exit 1; }

for file in \
  package.json \
  apps/web/package.json \
  apps/web/.env.example \
  apps/web/lib/session.ts \
  apps/web/lib/auth.ts \
  apps/web/lib/auth-config.ts \
  apps/web/lib/auth-client.ts \
  apps/web/proxy.ts \
  apps/web/app/api/auth/'[...all]'/route.ts \
  packages/db/package.json \
  packages/db/src/client.ts \
  packages/db/src/schema/index.ts \
  packages/db/src/schema/auth.ts; do
  [ -f "$file" ] || fail "missing $file"
done

node -e '
const fs = require("node:fs");
const root = JSON.parse(fs.readFileSync("package.json", "utf8"));
const web = JSON.parse(fs.readFileSync("apps/web/package.json", "utf8"));
const db = JSON.parse(fs.readFileSync("packages/db/package.json", "utf8"));
const all = p => ({ ...p.dependencies, ...p.devDependencies, ...p.peerDependencies });
for (const script of ["db:generate", "db:migrate", "db:push", "db:studio"]) {
  if (!root.scripts?.[script]) throw new Error(`missing root script ${script}`);
}
if (!all(web).next?.match(/16\./)) throw new Error("Next.js 16 is required");
if (!all(db)["@neondatabase/serverless"] || !all(db)["drizzle-orm"] || !all(db)["drizzle-kit"]) throw new Error("Neon/Drizzle packages missing");
if (!all(web)["better-auth"]) throw new Error("Better Auth package missing from apps/web");
' || fail "package contract validation failed"

for key in DATABASE_URL BETTER_AUTH_URL BETTER_AUTH_SECRET; do
  grep -q "$key" apps/web/.env.example || fail "apps/web/.env.example lacks $key"
done

if rg -l "^[[:space:]]*['\"]use client['\"]" apps/web packages/ui -g '*.ts' -g '*.tsx' 2>/dev/null | while read -r file; do
  rg -q '@workspace/db/client' "$file" && echo "$file"
done | grep -q .; then
  fail "a Client Component imports @workspace/db/client"
fi

echo "ok backend foundation structure is present"
